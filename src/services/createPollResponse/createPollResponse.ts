import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "@/services/api/createPostPollResponse";
import {
	InsertUserPerformance,
	UpdateUserPerformance,
	UpdateUserPerformance,
} from "@/types/db";
import { calculateBetXP } from "@/services/calculateXP";
import { START_MULTIPLIER_INCREASE } from "@/services/constants";
import { db } from "@/database/db";
import { pollUserPerformanceTable } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { getPreviousRunDataByCategoryCode } from "./runDataByCategory";
import { getPollOptions } from "./getPollOptions";
import { calculateBettingAverage } from "./calculateBettingAverage";
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

	if (error) {
		console.error("Error creating poll response:", error);
		throw new Error("Failed to create poll response");
	}

	if (!data || !data.response_id) {
		throw new Error("Failed to get response ID after creation");
	}

	return data;
};

export const createPollResponseOptions = async (
	supabase: SupabaseClient,
	responseId: number,
	selectedOptions: string[]
) => {
	console.log("Creating response options with responseId:", responseId);

	const responseOptions = selectedOptions.map((optionId) => ({
		response_id: responseId,
		option_id: Number(optionId),
	}));

	const { error } = await supabase
		.from("polls_response_options")
		.insert(responseOptions);

	if (error) {
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
		// Create poll response
		const response = await createPollResponse(supabase, poll.id, userId);

		// Create response options
		await createPollResponseOptions(
			supabase,
			response.response_id,
			selectedOptions
		);

		// Get all poll options to check if we selected all correct ones
		const pollOptions = await getPollOptions({
			supabase,
			pollId: poll.id,
		});

		// Get the correct options
		const correctOptions = pollOptions.filter((opt) => opt.is_correct);

		// Check if user selected any incorrect options
		const hasIncorrectAnswer = selectedOptions.some((selectedId) => {
			const option = pollOptions.find(
				(opt) => opt.id === Number(selectedId)
			);
			return option && !option.is_correct;
		});

		// Check if user selected all correct options
		const allCorrectOptionsSelected = correctOptions.every((correctOpt) =>
			selectedOptions.includes(correctOpt.id.toString())
		);

		// Get previous run data to calculate changes
		const previousData = await getPreviousRunDataByCategoryCode(
			userId,
			poll.category_code
		);

		const userPerformanceData = await getUserPerformanceData(
			userId,
			poll.category_code
		);

		const previousDevvotedScore = userPerformanceData[0]?.devvoted_score
			? Number(userPerformanceData[0].devvoted_score)
			: 0;

		const previousXP = previousData?.temporary_xp ?? 0;
		const previousMultiplier = Number(previousData?.streak_multiplier) || 0;
		const previousStreak = previousData?.current_streak ?? 0;

		// Calculate the new betting average
		const newBettingAverage = await calculateBettingAverage({
			supabase,
			userId,
			selectedBet,
		});

		// Type this object
		const result = {
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
				newBettingAverage: parseFloat(newBettingAverage),
			},
		};

		if (hasIncorrectAnswer || !allCorrectOptionsSelected) {
			console.log("❌ Incorrect answer - Resetting streak");
			await handleWrongPollResponse({
				supabase,
				userId,
				categoryCode: poll.category_code,
			});

			result.isCorrect = false;
			// For incorrect answers, we reset to default values
			result.changes.newXP = previousXP;
			result.changes.newMultiplier = 0;
			result.changes.newStreak = 0;
			result.changes.xpGain = 0;

			// For incorrect answers, devvoted_score might decrease slightly or stay the same
			// Fetch the updated score after handling the wrong response
			const updatedPerformance = await db
				.select()
				.from(pollUserPerformanceTable)
				.where(
					and(
						eq(pollUserPerformanceTable.user_id, userId),
						eq(
							pollUserPerformanceTable.category_code,
							poll.category_code
						)
					)
				)
				.limit(1);

			result.changes.devvotedScore = updatedPerformance[0]?.devvoted_score
				? Number(updatedPerformance[0].devvoted_score)
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

			const { data, error } = await supabase
				.from("polls_user_performance")
				.select("*")
				.eq("user_id", userId)
				.eq("category_code", poll.category_code)
				.maybeSingle();

			if (error) {
				console.error("Error fetching user performance:", error);
				return null;
			}

			console.log("previousUserPerformanceData", data);

			// Update the betting average in the user performance table
			await upsertScoresToPollUserPerformance({
				supabase,
				user_id: userId,
				category_code: poll.category_code,
				// devvoted_score: "12.23",
				// @TODO: This doesn't work, string concatenation
				betting_average: (
					(data?.betting_average ?? 0) + Number(newBettingAverage)
				).toFixed(1),
			});

			result.isCorrect = true;
			result.changes.newXP = newXP;
			result.changes.xpGain = xpCalculation.totalXP;
			result.changes.newMultiplier = Number(newMultiplier);
			result.changes.newStreak = newStreak;

			// For correct answers, fetch the updated devvoted_score after handling the correct response
			const updatedPerformance = await db
				.select()
				.from(pollUserPerformanceTable)
				.where(
					and(
						eq(pollUserPerformanceTable.user_id, userId),
						eq(
							pollUserPerformanceTable.category_code,
							poll.category_code
						)
					)
				)
				.limit(1);

			result.changes.devvotedScore = updatedPerformance[0]?.devvoted_score
				? Number(updatedPerformance[0].devvoted_score)
				: previousDevvotedScore;
		}

		return result;
	} catch (error) {
		console.error("Error in createPostPollResponse:", error);
		throw error;
	}
};
