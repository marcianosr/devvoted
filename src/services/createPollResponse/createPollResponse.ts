import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "@/services/api/createPostPollResponse";
import { calculateBetXP } from "@/services/calculateXP";
import {
	START_MULTIPLIER_INCREASE,
	START_TEMPORARY_XP,
} from "@/services/constants";
import { db } from "@/database/db";
import { pollResponseOptionsTable } from "@/database/schema";
import { getRunDataByCategoryCode } from "./runDataByCategory";
import { getBettingAverage } from "./calculateBettingAverage";
import { handleWrongPollResponse } from "./handleWrongPollResponse";
import { handleCorrectPollResponse } from "./handleCorrectPollResponse";
import { getUserPerformanceData } from "./getUserPerformanceData";
import { upsertScoresToPollUserPerformance } from "./upsertScoresToPollUserPerformance";
import { getStreakMultiplierIncreaseForBet } from "@/services/multipliers";
import { evaluatePollResponse } from "./evaluatePollResponse";
import { buildPollResult } from "./buildPollResult";

// Not sure where to put this file, as it is inserting data triggerd by /api/submit-response
export const createPollResponse = async (
	supabase: SupabaseClient,
	pollId: number,
	userId: string
) => {
	const { data, error } = await supabase
		.from("polls_responses")
		.insert({
			poll_id: pollId,
			user_id: userId,
		})
		.select("response_id")
		.single();

	if (error) throw new Error("Failed to create poll response");

	if (!data || !data.response_id) {
		throw new Error("Failed to get response ID after creation");
	}

	return data;
};

export const createPollResponseOptions = async (
	responseId: number,
	selectedOptions: string[]
) => {
	try {
		console.log("Creating response options with responseId:", responseId);

		// Rewrite to ORM query drizzle:
		const responseOptions = selectedOptions.map((optionId) => ({
			response_id: responseId,
			option_id: Number(optionId),
		}));

		const data = await db
			.insert(pollResponseOptionsTable)
			.values(responseOptions);

		return data;
	} catch (error) {
		console.error("Error creating poll response options:", error);
		throw new Error("Failed to create poll response options");
	}
};

export const createPostPollResponse = async ({
	poll,
	userId,
	selectedOptions,
	selectedBet,
}: CreatePostPollResponseRequest) => {
	const supabase = await createClient();

	try {
		const {
			previousXP,
			previousMultiplier,
			previousStreak,
			previousDevvotedScore,
			newBettingAverage,
			previousBettingAverage,
		} = await getRunAndUserPerformanceData(
			userId,
			poll.category_code,
			selectedBet
		);

		const { hasIncorrectOption, hasAllCorrectOptionsSelected } =
			await evaluatePollResponse({
				supabase,
				poll,
				userId,
				selectedOptions,
			});

		if (hasIncorrectOption || !hasAllCorrectOptionsSelected) {
			console.log("❌ Incorrect answer - Resetting streak");
			await handleWrongPollResponse({
				supabase,
				userId,
				categoryCode: poll.category_code,
			});

			const result = await buildPollResult({
				status: "incorrect",
				previousStats: {
					xp: previousXP,
					multiplier: previousMultiplier,
					streak: previousStreak,
					devvotedScore: previousDevvotedScore,
					bettingAverage: previousBettingAverage,
				},
				newStats: {
					xp: START_TEMPORARY_XP,
					multiplier: Number(START_MULTIPLIER_INCREASE),
					streak: 0,
					devvotedScore: previousDevvotedScore,
					bettingAverage: newBettingAverage,
				},
			});

			// ! Consider refactoring this into a single function call
			await upsertScoresToPollUserPerformance({
				supabase,
				user_id: userId,
				category_code: poll.category_code,
				devvoted_score: previousDevvotedScore.toFixed(2),
				betting_average: Number(newBettingAverage).toFixed(1), // Ensure we store the calculated average
			});

			return result;

			// For incorrect answers, devvoted_score might decrease slightly or stay the same
			// Fetch the updated score after handling the wrong response
			// COULD possible be the same as getUserPerformanceQuery

			// const updatedPerformanceData = await getUserPerformanceData(
			// 	userId,
			// 	poll.category_code
			// );

			// result.changes.devvotedScore =
			// 	updatedPerformanceData?.devvoted_score
			// 		? Number(updatedPerformanceData.devvoted_score)
			// 		: previousDevvotedScore;
		} else {
			console.log("✅ Correct answer - Updating streak and XP");

			// Get streak multiplier increase based on betting percentage
			const multiplierIncrease =
				getStreakMultiplierIncreaseForBet(selectedBet);

			// Calculate new multiplier with the dynamic increase
			const newMultiplier = (
				previousMultiplier + multiplierIncrease
			).toFixed(1);

			const xpCalculation = calculateBetXP({
				availableXP: previousXP,
				betPercentage: selectedBet,
				streakMultiplier: Number(newMultiplier),
			});

			const newXP = previousXP + xpCalculation.totalXP;
			const newStreak = previousStreak + 1;

			await handleCorrectPollResponse({
				selectedBet,
				userId,
				categoryCode: poll.category_code,
				calculatedXP: xpCalculation.totalXP, // Pass the calculated XP value
			});

			// Calculate and update the devvoted score
			// The score should increase due to improved accuracy and potentially higher streak multiplier
			const result = await buildPollResult({
				status: "correct",
				previousStats: {
					xp: previousXP,
					multiplier: previousMultiplier,
					streak: previousStreak,
					devvotedScore: previousDevvotedScore,
					bettingAverage: previousBettingAverage,
				},
				newStats: {
					xp: newXP,
					multiplier: Number(newMultiplier),
					streak: newStreak,
					devvotedScore: previousDevvotedScore,
					bettingAverage: newBettingAverage,
				},
			});

			return result;

			// For correct answers, fetch the updated devvoted_score after handling the correct response
			// const updatedPerformanceData = await getUserPerformanceData(
			// 	userId,
			// 	poll.category_code
			// );

			// result.changes.devvotedScore =
			// 	updatedPerformanceData?.devvoted_score
			// 		? Number(updatedPerformanceData.devvoted_score)
			// 		: previousDevvotedScore;
		}

		return result;
	} catch (error) {
		console.error("Error in createPostPollResponse:", error);
		throw error;
	}
};

const getRunAndUserPerformanceData = async (
	userId: string,
	categoryCode: string,
	selectedBet: number
) => {
	const previousRunData = await getRunDataByCategoryCode(
		userId,
		categoryCode
	);
	const previousUserPerformanceData = await getUserPerformanceData(
		userId,
		categoryCode
	);

	return {
		previousXP: previousRunData?.temporary_xp ?? 0,
		previousMultiplier: Number(previousRunData?.streak_multiplier) || 0,
		previousStreak: previousRunData?.current_streak ?? 0,
		previousDevvotedScore: previousUserPerformanceData?.devvoted_score
			? Number(previousUserPerformanceData.devvoted_score)
			: 0,
		previousBettingAverage: (
			await getBettingAverage({ userId, categoryCode, selectedBet })
		).previousBettingAverage,
		newBettingAverage: (
			await getBettingAverage({ userId, categoryCode, selectedBet })
		).newBettingAverage,
	};
};
