import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "@/domain/api/createPostPollResponse";
import { calculateBetXP } from "@/domain/score-calculation/calculateXP";
import { START_MULTIPLIER_INCREASE } from "@/domain/constants";
import { db } from "@/database/db";
import { pollResponseOptionsTable } from "@/database/schema";
import { getRunDataByCategoryCode } from "../run/runDataByCategory";
import { getBettingAverage } from "./calculateBettingAverage";
import { handleWrongPollResponse } from "./handleWrongPollResponse";
import { handleCorrectPollResponse } from "./handleCorrectPollResponse";
import { getUserPerformanceData } from "../user/getUserPerformanceData";
import { upsertScoresToPollUserPerformance } from "../user/upsertScoresToPollUserPerformance";
import { getStreakMultiplierIncreaseForBet } from "@/domain/score-calculation/multipliers";
import { evaluatePollResponse } from "./evaluatePollResponse";
import { buildPollResult } from "../poll-result/buildPollResult";
import { calculateDevvotedScore } from "@/domain/devvotedScore";

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

/**
 * Processes a user's poll response and updates their performance metrics accordingly.
 *
 * This function handles both correct and incorrect responses by:
 * 1. Evaluating the response against the correct options
 * 2. Updating user performance metrics (XP, streak, multipliers)
 * 3. Calculating Knowledge Score based on accuracy, streak multiplier, and betting multiplier
 * 4. Applying different reward/penalty logic based on response correctness
 *
 * For correct answers:
 *   - Single choice polls: Full points when correct
 *   - Multiple choice polls: Points proportional to correct answers selected
 *   - Increases streak, applies multipliers, and awards XP based on bet size
 *
 * For incorrect answers: Resets streak, adjusts multipliers, and updates betting average
 *
 * @returns A BuildPollResult object containing success status, correctness, and performance changes
 */
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

		const evaluationResult = await evaluatePollResponse({
			supabase,
			poll,
			userId,
			selectedOptions,
		});

		const {
			hasIncorrectOption,
			hasAllCorrectOptionsSelected,
			isSingleChoice,
			correctnessScore,
			selectedCorrectOptionsCount,
		} = evaluationResult;

		// For multiple choice polls, we consider it partially correct if the correctnessScore is > 0
		// For single choice polls, it's either fully correct or incorrect
		const isFullyCorrect =
			!hasIncorrectOption && hasAllCorrectOptionsSelected;

		// A response is partially correct if:
		// 1. It's a multiple choice poll AND
		// 2. Either the correctness score is > 0 OR the user selected at least one correct option
		// 3. And it's not fully correct
		const isPartiallyCorrect =
			!isSingleChoice &&
			(correctnessScore > 0 || selectedCorrectOptionsCount > 0) &&
			!isFullyCorrect;

		// Log the evaluation details for debugging
		console.log(
			`Evaluation details: isSingleChoice=${isSingleChoice}, correctnessScore=${correctnessScore}, hasIncorrectOption=${hasIncorrectOption}, hasAllCorrectOptionsSelected=${hasAllCorrectOptionsSelected}, selectedCorrectOptionsCount=${selectedCorrectOptionsCount}`
		);
		console.log(
			`Result: isFullyCorrect=${isFullyCorrect}, isPartiallyCorrect=${isPartiallyCorrect}`
		);

		if (!isFullyCorrect && !isPartiallyCorrect) {
			console.log("❌ Incorrect answer - Resetting streak");

			// Handle the wrong poll response and get the new decreased DevVoted score and new XP
			const { newDevvotedScore, newXP } = await handleWrongPollResponse({
				supabase,
				userId,
				categoryCode: poll.category_code,
				selectedBet, // Pass the selected bet percentage
			});

			console.log(`Previous DevVoted score: ${previousDevvotedScore}`);
			console.log(`New decreased DevVoted score: ${newDevvotedScore}`);
			console.log(`New XP after deduction: ${newXP}`);

			// Build the result object to return
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
					xp: newXP, // Use the new XP value after deduction
					multiplier: Number(START_MULTIPLIER_INCREASE),
					streak: 0, // Reset streak
					devvotedScore: newDevvotedScore,
					bettingAverage: previousBettingAverage, // Betting average doesn't change for incorrect answers
				},
			});

			// Update the user performance with the new DevVoted score and betting average
			await upsertScoresToPollUserPerformance({
				supabase,
				user_id: userId,
				category_code: poll.category_code,
				devvoted_score: newDevvotedScore.toFixed(2),
				betting_average: Number(newBettingAverage).toFixed(1), // Ensure we store the calculated average
			});

			return result;
		} else {
			// Handle fully correct answers (for both single and multiple choice)
			// or partially correct answers (for multiple choice only)
			const isFullyCorrect =
				!hasIncorrectOption && hasAllCorrectOptionsSelected;
			const responseStatus = isFullyCorrect
				? "correct"
				: "partially_correct";

			console.log(
				`${
					isFullyCorrect ? "✅ Fully correct" : "🤔 Partially correct"
				} answer - Updating streak and XP`
			);
			console.log(
				`Poll type: ${
					isSingleChoice ? "Single choice" : "Multiple choice"
				}, Correctness score: ${correctnessScore}`
			);

			// Get streak multiplier increase based on betting percentage
			const multiplierIncrease =
				getStreakMultiplierIncreaseForBet(selectedBet);

			// Calculate new multiplier with the dynamic increase
			const newMultiplier = (
				previousMultiplier + multiplierIncrease
			).toFixed(1);

			// Calculate XP based on the poll type and correctness
			let xpCalculation;

			if (isSingleChoice || isFullyCorrect) {
				// For single choice polls or fully correct multiple choice answers: full points
				xpCalculation = calculateBetXP({
					availableXP: previousXP,
					betPercentage: selectedBet,
					streakMultiplier: Number(newMultiplier),
				});
			} else {
				// For partially correct multiple choice answers: proportional points
				// Scale the bet percentage by the correctness score
				const adjustedBetPercentage = selectedBet * correctnessScore;
				console.log(
					`Adjusted bet percentage for partial correctness: ${adjustedBetPercentage.toFixed(
						1
					)}% (${selectedBet}% × ${correctnessScore.toFixed(2)})`
				);

				xpCalculation = calculateBetXP({
					availableXP: previousXP,
					betPercentage: adjustedBetPercentage,
					streakMultiplier: Number(newMultiplier),
				});
			}

			const newXP = previousXP + xpCalculation.totalXP;
			const newStreak = previousStreak + 1;

			await handleCorrectPollResponse({
				selectedBet,
				userId,
				categoryCode: poll.category_code,
				calculatedXP: xpCalculation.totalXP, // Pass the calculated XP value
			});

			console.log(`Previous DevVoted score: ${previousDevvotedScore}`);
			console.log(
				`Calculating new DevVoted score with multiplier: ${newMultiplier} and betting average: ${newBettingAverage}`
			);

			// Calculate the new DevVoted score based on the formula:
			// Knowledge Score = Accuracy × Streak Multiplier × Betting Multiplier
			const newDevvotedScore = await calculateDevvotedScore({
				userId,
				categoryCode: poll.category_code,
				currentStreakMultiplier: Number(newMultiplier),
				bettingAverage: Number(newBettingAverage),
			});

			console.log(`Calculated new DevVoted score: ${newDevvotedScore}`);

			// Calculate and update the devvoted score
			// The score should increase due to improved accuracy and potentially higher streak multiplier
			const result = await buildPollResult({
				status: responseStatus,
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
					devvotedScore: newDevvotedScore,
					bettingAverage: newBettingAverage,
				},
			});

			// Update the user performance data with the new DevVoted score
			// Format the score as a string with 2 decimal places to match the database schema
			const formattedDevvotedScore = newDevvotedScore.toFixed(2);
			console.log("Updating DevVoted score to:", formattedDevvotedScore);

			await upsertScoresToPollUserPerformance({
				supabase,
				user_id: userId,
				category_code: poll.category_code,
				devvoted_score: formattedDevvotedScore,
				betting_average: Number(newBettingAverage).toFixed(1),
			});

			return result;
		}
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
