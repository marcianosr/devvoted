/**
 * Devvoted Score calculation service
 *
 * The Devvoted Score is calculated as: Accuracy × Streak Multiplier × Betting Multiplier
 *
 * - Accuracy: (correct - incorrect) ÷ total_polls
 * - Streak Multiplier: Current streak multiplier for the category
 * - Betting Multiplier: Based on risk-taking average (Conservative: 1.2x, Moderate: 1.5x, Aggressive: 2.0x)
 */

import { db } from "@/database/db";
import { pollResponsesTable, pollsTable } from "@/database/schema";
import { and, count, eq, sql } from "drizzle-orm";
import { getBettingMultiplierForBet } from "./multipliers";

type DevvotedScoreParams = {
	userId: string;
	categoryCode: string;
	currentStreakMultiplier: number;
	bettingAverage: number;
};

/**
 * Calculates the Devvoted Score for a user in a specific category
 *
 * @param userId - The user ID
 * @param categoryCode - The category code
 * @param currentStreakMultiplier - The current streak multiplier
 * @param bettingAverage - The user's betting average (1-100)
 * @returns The calculated devvoted score
 */
export const calculateDevvotedScore = async ({
	userId,
	categoryCode,
	currentStreakMultiplier,
	bettingAverage,
}: DevvotedScoreParams): Promise<number> => {
	try {
		console.log(`Calculating DevVoted score for user ${userId} in category ${categoryCode}`);
		console.log(`Current streak multiplier: ${currentStreakMultiplier}, Betting average: ${bettingAverage}`);

		// Get total number of polls answered in this category
		const totalPollsResult = await db
			.select({ count: count() })
			.from(pollResponsesTable)
			.innerJoin(pollsTable, eq(pollResponsesTable.poll_id, pollsTable.id))
			.where(
				and(
					eq(pollResponsesTable.user_id, userId),
					eq(pollsTable.category_code, categoryCode)
				)
			);

		const totalPolls = totalPollsResult[0]?.count || 0;
		console.log(`Total polls answered: ${totalPolls}`);

		if (totalPolls === 0) {
			console.log('No polls answered yet, returning 0');
			return 0; // No polls answered yet
		}

		// Get correct and incorrect answers
		// This query counts the number of correct responses by joining poll_responses,
		// poll_response_options, and poll_options tables
		const correctResponsesResult = await db.execute(sql`
      SELECT COUNT(DISTINCT pr.response_id) as correct_count
      FROM polls_responses pr
      JOIN polls_response_options pro ON pr.response_id = pro.response_id
      JOIN polls_options po ON pro.option_id = po.id
      JOIN polls p ON pr.poll_id = p.id
      WHERE pr.user_id = ${userId}
        AND p.category_code = ${categoryCode}
        AND po.is_correct = true
        AND NOT EXISTS (
          -- Subquery to exclude responses where any incorrect option was selected
          SELECT 1
          FROM polls_response_options pro2
          JOIN polls_options po2 ON pro2.option_id = po2.id
          WHERE pro2.response_id = pr.response_id
            AND po2.is_correct = false
        )
    `);

		const correctCount = Number(
			correctResponsesResult[0]?.correct_count || 0
		);
		const incorrectCount = totalPolls - correctCount;

		// Calculate accuracy factor: (correct - incorrect) ÷ total_polls
		// This can range from -1 to 1
		const accuracyFactor = (correctCount - incorrectCount) / totalPolls;
		console.log(`Correct answers: ${correctCount}, Incorrect answers: ${incorrectCount}`);
		console.log(`Accuracy factor: ${accuracyFactor}`);

		// Allow for negative accuracy factor to decrease the score when user answers incorrectly
		// We'll use the raw accuracyFactor to allow score decreases
		console.log(`Using accuracy factor: ${accuracyFactor}`);

		// Get betting multiplier based on average betting percentage
		const bettingMultiplier = getBettingMultiplierForBet(bettingAverage);
		console.log(`Betting multiplier: ${bettingMultiplier}`);

		// Calculate final devvoted score
		// Devvoted Score = Accuracy × Streak Multiplier × Betting Multiplier
		const devvotedScore =
			accuracyFactor * currentStreakMultiplier * bettingMultiplier;
		console.log(`Final DevVoted score: ${devvotedScore} (${devvotedScore.toFixed(2)})`);

		// Return the score rounded to 2 decimal places
		return parseFloat(devvotedScore.toFixed(2));
	} catch (error) {
		console.error("Error calculating devvoted score:", error);
		return 0;
	}
};
