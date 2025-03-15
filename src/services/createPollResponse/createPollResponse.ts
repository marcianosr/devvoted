import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "@/services/api/createPostPollResponse";
import { ActiveRun, InsertUserPerformance, UpdateActiveRun } from "@/types/db";
import { calculateBetXP } from "@/services/calculateXP";
import {
	START_MULTIPLIER_INCREASE,
	startRunSettings,
} from "@/services/constants";
import { db } from "@/database/db";
import { pollUserPerformanceTable } from "@/database/schema";
import { eq, and } from "drizzle-orm";

type FetchPollOptionsFn = {
	supabase: SupabaseClient;
	pollId: number;
};

const fetchPollOptions = async ({ supabase, pollId }: FetchPollOptionsFn) => {
	const { data, error } = await supabase
		.from("polls_options")
		.select("*")
		.eq("poll_id", pollId);
	if (error) throw new Error("Failed to fetch poll options");
	return data;
};

export const getPreviousRunDataByCategoryCode = async (
	userId: string,
	categoryCode: string
): Promise<ActiveRun | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("polls_active_runs")
		.select("*")
		.eq("user_id", userId)
		.eq("category_code", categoryCode)
		.limit(1)
		.maybeSingle<ActiveRun>();

	if (error)
		throw new Error(`Error getting previous streak: ${error.message}`);

	return data;
};

export const updateActiveRunByCategoryCode = async (
	activeRun: Partial<UpdateActiveRun>,
	categoryCode: string
) => {
	const supabase = await createClient();

	const { error } = await supabase
		.from("polls_active_runs")
		.update(activeRun)
		.eq("category_code", categoryCode)
		.eq("user_id", activeRun.user_id);

	if (error) throw new Error(`Error creating active run: ${error.message}`);
};

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

export const resetActiveRunByCategoryCode = async ({
	userId,
	categoryCode,
}: {
	userId: string;
	categoryCode: string;
}) => {
	const supabase = await createClient();
	const { error } = await supabase
		.from("polls_active_runs")
		.update({ ...startRunSettings, last_poll_at: new Date() })
		.eq("category_code", categoryCode)
		.eq("user_id", userId);
	if (error) throw new Error(`Error resetting active run: ${error.message}`);

	return { success: true };
};

const decreaseAttemptsForUser = async (userId: string) => {
	const supabase = await createClient();
	const { data: user, error } = await supabase
		.from("users")
		.select("run_attempts")
		.eq("id", userId)
		.single();
	if (error || !user?.run_attempts)
		throw new Error(`Error fetching user attempts: ${error?.message}`);

	const newAttempts = Math.max(user.run_attempts - 1, 0);
	await supabase
		.from("users")
		.update({ run_attempts: newAttempts })
		.eq("id", userId);

	if (newAttempts === 0) await resetActiveRunByAllCategories({ userId });
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

const upsertScoresToPollUserPerformance = async ({
	user_id,
	category_code,
	devvoted_score,
	betting_average,
}: InsertUserPerformance) => {
	const supabase = await createClient();

	const { error } = await supabase.from("polls_user_performance").upsert(
		{
			user_id,
			category_code,
			devvoted_score,
			betting_average,
		},
		{
			onConflict: "user_id, category_code",
		}
	);

	if (error)
		throw new Error(
			`Error inserting poll user performance: ${error.message}`
		);
};

// Calculate the betting average for a user in a specific category
const calculateBettingAverage = async (
	userId: string,
	currentBet: number,
	previousBettingAverage: number
): Promise<string> => {
	const supabase = await createClient();

	// Get all poll responses for this user in this category
	const { data: pollResponses, error } = await supabase
		.from("polls_responses")
		.select("poll_id, response_id")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching poll responses:", error);
		return currentBet.toFixed(1); // Return current bet if we can't calculate average
	}

	// If this is the first response, just return the current bet
	if (!pollResponses || pollResponses.length === 0) {
		return currentBet.toFixed(1);
	}

	// Get all previous bets from the database
	// For now, we'll simulate this by using the current bet for all responses
	// In a real implementation, you would fetch the actual bet values from a table that stores them

	// Calculate average including the current bet
	const totalResponses = pollResponses.length + 1; // +1 for current response
	const previousBetsSum = pollResponses.length * currentBet; // Simplified for now
	const newAverage = (previousBetsSum + currentBet) / totalResponses;

	return newAverage.toFixed(1);
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
		const pollOptions = await fetchPollOptions({
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

		// Fetch current user performance data to get the devvoted_score
		const userPerformanceData = await db
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

		const previousDevvotedScore = userPerformanceData[0]?.devvoted_score
			? Number(userPerformanceData[0].devvoted_score)
			: 0;

		const previousBettingAverage = userPerformanceData[0]?.betting_average
			? Number(userPerformanceData[0].betting_average)
			: 0;

		const previousXP = previousData?.temporary_xp ?? 0;
		const previousMultiplier = Number(previousData?.streak_multiplier) || 0;
		const previousStreak = previousData?.current_streak ?? 0;

		// Calculate the new betting average
		const newBettingAverage = await calculateBettingAverage(
			userId,
			selectedBet,
			previousBettingAverage
		);

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

			// const previousBettingAverageData = await db
			// 	.select()
			// 	.from(pollUserPerformanceTable)
			// 	.where(
			// 		and(
			// 			eq(pollUserPerformanceTable.user_id, userId),
			// 			eq(
			// 				pollUserPerformanceTable.category_code,
			// 				poll.category_code
			// 			)
			// 		)
			// 	)
			// 	.limit(1);

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

const handleCorrectPollResponse = async ({
	selectedBet,
	userId,
	categoryCode,
}: {
	selectedBet: number;
	userId: string;
	categoryCode: string;
}) => {
	// Get and update streak multiplier
	const previousData = await getPreviousRunDataByCategoryCode(
		userId,
		categoryCode
	);

	const currentMultiplier = Number(previousData?.streak_multiplier) || 0;
	const newMultiplier = (
		currentMultiplier + Number(START_MULTIPLIER_INCREASE)
	).toFixed(1);

	const currentXP = previousData?.temporary_xp ?? 0;
	const xpCalculation = calculateBetXP({
		availableXP: currentXP,
		betPercentage: selectedBet,
		streakMultiplier: Number(newMultiplier),
	});

	// update and find active run
	await updateActiveRunByCategoryCode(
		{
			user_id: userId,
			temporary_xp: currentXP + xpCalculation.totalXP,
			streak_multiplier: newMultiplier,
			last_poll_at: new Date(),
			current_streak: previousData ? previousData.current_streak + 1 : 0,
		},
		categoryCode
	);

	// Update user performance metrics
	// 1. Update best_multiplier if the new multiplier is higher
	// 2. Update devvoted_score (simplified calculation for now)
	// Note: betting_average is already updated in createPostPollResponse
	const userPerformanceData = await db
		.select()
		.from(pollUserPerformanceTable)
		.where(
			and(
				eq(pollUserPerformanceTable.user_id, userId),
				eq(pollUserPerformanceTable.category_code, categoryCode)
			)
		)
		.limit(1);

	if (userPerformanceData.length > 0) {
		const currentBestMultiplier =
			Number(userPerformanceData[0].best_multiplier) || 0;
		const currentDevvotedScore =
			Number(userPerformanceData[0].devvoted_score) || 0;

		// Only update best_multiplier if new value is higher
		const bestMultiplier =
			Number(newMultiplier) > currentBestMultiplier
				? newMultiplier
				: userPerformanceData[0].best_multiplier;

		// Calculate a "fake" devvoted_score for now - increases with each correct answer
		// This is a simplified calculation that can be replaced with a more complex algorithm later
		const newDevvotedScore = (
			currentDevvotedScore +
			xpCalculation.totalXP * 0.1
		).toFixed(2);

		await db
			.update(pollUserPerformanceTable)
			.set({
				best_multiplier: bestMultiplier,
				devvoted_score: newDevvotedScore,
				updated_at: new Date(),
			})
			.where(
				and(
					eq(pollUserPerformanceTable.user_id, userId),
					eq(pollUserPerformanceTable.category_code, categoryCode)
				)
			);
	}
};

const handleWrongPollResponse = async ({
	userId,
	categoryCode,
}: {
	userId: string;
	categoryCode: string;
}) => {
	await resetActiveRunByCategoryCode({
		userId,
		categoryCode,
	});

	// Update user performance metrics for wrong answers
	// 1. Decrease devvoted_score slightly (or keep it the same if it's already low)
	// Note: best_multiplier is not affected by wrong answers
	const userPerformanceData = await db
		.select()
		.from(pollUserPerformanceTable)
		.where(
			and(
				eq(pollUserPerformanceTable.user_id, userId),
				eq(pollUserPerformanceTable.category_code, categoryCode)
			)
		)
		.limit(1);

	if (userPerformanceData.length > 0) {
		const currentDevvotedScore =
			Number(userPerformanceData[0].devvoted_score) || 0;

		// For wrong answers, slightly decrease the devvoted_score (minimum 0)
		// This is a simplified calculation that can be replaced with a more complex algorithm later
		const newDevvotedScore = Math.max(
			0,
			currentDevvotedScore - 0.5
		).toFixed(2);

		await db
			.update(pollUserPerformanceTable)
			.set({
				devvoted_score: newDevvotedScore,
				updated_at: new Date(),
			})
			.where(
				and(
					eq(pollUserPerformanceTable.user_id, userId),
					eq(pollUserPerformanceTable.category_code, categoryCode)
				)
			);
	}

	await decreaseAttemptsForUser(userId);
};

export const resetActiveRunByAllCategories = async ({
	userId,
}: {
	userId: string;
}) => {
	const supabase = await createClient();

	const { error: pollsActiveRunError } = await supabase
		.from("polls_active_runs")
		.delete()
		.eq("user_id", userId);

	if (pollsActiveRunError)
		throw new Error(
			`Error resetting active run: ${pollsActiveRunError.message}`
		);

	const { error: userError } = await supabase
		.from("users")
		.update({
			active_config: null,
		})
		.eq("id", userId);
	if (userError)
		throw new Error(`Error resetting active run: ${userError.message}`);

	return { success: true };
};
