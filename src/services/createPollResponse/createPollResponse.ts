import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {
	CreatePostPollResponseRequest,
	PollResponseResult,
} from "@/services/api/createPostPollResponse";
import { calculateBetXP } from "@/services/calculateXP";
import {
	START_MULTIPLIER_INCREASE,
	START_TEMPORARY_XP,
} from "@/services/constants";
import { db } from "@/database/db";
import {
	pollResponseOptionsTable,
	pollUserPerformanceTable,
} from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { getRunDataByCategoryCode } from "./runDataByCategory";
import { getPollOptions } from "./getPollOptions";
import { getBettingAverage } from "./calculateBettingAverage";
import { handleWrongPollResponse } from "./handleWrongPollResponse";
import { handleCorrectPollResponse } from "./handleCorrectPollResponse";
import { getUserPerformanceData } from "./getUserPerformanceData";
import { upsertScoresToPollUserPerformance } from "./upsertScoresToPollUserPerformance";

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
		const response = await createPollResponse(supabase, poll.id, userId);
		await createPollResponseOptions(response.response_id, selectedOptions);
		const pollOptions = await getPollOptions({
			supabase,
			pollId: poll.id,
		});
		const correctOptions = pollOptions.filter((opt) => opt.is_correct);
		const hasIncorrectOption = selectedOptions.some((selectedId) => {
			const option = pollOptions.find(
				(opt) => opt.id === Number(selectedId)
			);
			return option && !option.is_correct;
		});
		const hasAllCorrectOptionsSelected = correctOptions.every(
			(correctOpt) => selectedOptions.includes(correctOpt.id.toString())
		);

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

		const result: PollResponseResult = {
			success: true,
			isCorrect: false,
			changes: {
				previousXP,
				newXP: previousXP,
				xpGain: 0,
				previousMultiplier,
				newMultiplier: previousMultiplier,
				previousStreak,
				newStreak: previousStreak,
				devvotedScore: previousDevvotedScore,
				newBettingAverage,
				previousBettingAverage,
			},
		};

		if (hasIncorrectOption || !hasAllCorrectOptionsSelected) {
			console.log("❌ Incorrect answer - Resetting streak");
			await handleWrongPollResponse({
				supabase,
				userId,
				categoryCode: poll.category_code,
			});

			result.isCorrect = false;
			// For incorrect answers, we reset to default values
			result.changes.newXP = START_TEMPORARY_XP;
			result.changes.newMultiplier = Number(START_MULTIPLIER_INCREASE);
			result.changes.newStreak = 0;
			result.changes.xpGain = 0;

			// ! Consider refactoring this into a single function call
			await upsertScoresToPollUserPerformance({
				supabase,
				user_id: userId,
				category_code: poll.category_code,
				devvoted_score: previousDevvotedScore.toFixed(2),
				betting_average: Number(newBettingAverage).toFixed(1), // Ensure we store the calculated average
			});

			// For incorrect answers, devvoted_score might decrease slightly or stay the same
			// Fetch the updated score after handling the wrong response
			// COULD possible be the same as getUserPerformanceQuery

			const updatedPerformance = await getUserPerformanceData(
				userId,
				poll.category_code
			);

			result.changes.devvotedScore = updatedPerformance?.devvoted_score
				? Number(updatedPerformance.devvoted_score)
				: previousDevvotedScore;
		} else {
			console.log("✅ Correct answer - Updating streak and XP");

			const newMultiplier = (
				previousMultiplier + Number(START_MULTIPLIER_INCREASE)
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
			});

			// ! Consider refactoring this into a single function call
			await upsertScoresToPollUserPerformance({
				supabase,
				user_id: userId,
				category_code: poll.category_code,
				devvoted_score: previousDevvotedScore.toFixed(2),
				betting_average: Number(newBettingAverage).toFixed(1), // Ensure we store the calculated average
			});

			result.isCorrect = true;
			result.changes.newXP = newXP;
			result.changes.xpGain = xpCalculation.totalXP;
			result.changes.newMultiplier = Number(newMultiplier);
			result.changes.newStreak = newStreak;

			// For correct answers, fetch the updated devvoted_score after handling the correct response
			const updatedPerformance = await getUserPerformanceData(
				userId,
				poll.category_code
			);

			result.changes.devvotedScore = updatedPerformance?.devvoted_score
				? Number(updatedPerformance.devvoted_score)
				: previousDevvotedScore;
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
			await getBettingAverage({ userId, selectedBet })
		).previousBettingAverage,
		newBettingAverage: (await getBettingAverage({ userId, selectedBet }))
			.newBettingAverage,
	};
};
