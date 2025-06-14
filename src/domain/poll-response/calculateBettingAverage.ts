import { db } from "@/database/db";
import {
	pollResponsesTable,
	pollUserPerformanceTable,
	pollsTable,
} from "@/database/schema";
import { eq, and } from "drizzle-orm";

type CalculateBettingAverageFn = {
	userId: string;
	categoryCode: string;
	selectedBet: number;
};

type CalculateBettingAverageFnResult = {
	newBettingAverage: string;
	previousBettingAverage: string;
};

/**
 * Fetches the count of polls answered by a user in a specific category
 * 
 * @param userId - The user ID
 * @param categoryCode - The category code
 * @returns The number of polls answered by the user in the category
 */
export const getPollsAnsweredCount = async (
	userId: string,
	categoryCode: string
): Promise<number> => {
	try {
		const responses = await db
			.select({ response_id: pollResponsesTable.response_id })
			.from(pollResponsesTable)
			.innerJoin(
				pollsTable,
				eq(pollResponsesTable.poll_id, pollsTable.id)
			)
			.where(
				and(
					eq(pollResponsesTable.user_id, userId),
					eq(pollsTable.category_code, categoryCode)
				)
			);

		return responses.length;
	} catch (error) {
		console.error("Error fetching polls answered count:", error);
		return 0;
	}
};

/**
 * Fetches the previous betting average for a user in a specific category
 * 
 * @param userId - The user ID
 * @param categoryCode - The category code
 * @returns The previous betting average as a string
 */
export const getPreviousBettingAverage = async (
	userId: string,
	categoryCode: string
): Promise<string> => {
	try {
		const data = await db
			.select({
				betting_average: pollUserPerformanceTable.betting_average,
			})
			.from(pollUserPerformanceTable)
			.where(
				and(
					eq(pollUserPerformanceTable.user_id, userId),
					eq(pollUserPerformanceTable.category_code, categoryCode)
				)
			)
			.limit(1);

		return data.length > 0 ? data[0].betting_average : "0.0";
	} catch (error) {
		console.error("Error fetching previous betting average:", error);
		return "0.0";
	}
};

/**
 * Calculates the new betting average for a user in a specific category
 * 
 * Formula: newAverage = (previousAverage * numberOfItems + newValue) / (numberOfItems + 1)
 * 
 * @param userId - The user ID
 * @param categoryCode - The category code
 * @param selectedBet - The current bet percentage (1-100)
 * @returns The previous and new betting average
 */
export const getBettingAverage = async ({
	categoryCode,
	userId,
	selectedBet,
}: CalculateBettingAverageFn): Promise<CalculateBettingAverageFnResult> => {
	try {
		const previousAverage = await getPreviousBettingAverage(
			userId,
			categoryCode
		);
		const pollsAnsweredCount = await getPollsAnsweredCount(userId, categoryCode);
		
		// If this is the first poll, the average is just the selected bet
		if (pollsAnsweredCount === 0) {
			return {
				previousBettingAverage: "0.0",
				newBettingAverage: selectedBet.toFixed(1),
			};
		}
		
		// Calculate the new average using the running average formula
		// newAverage = (previousAverage * numberOfItems + newValue) / (numberOfItems + 1)
		const newAverage = 
			(Number(previousAverage) * pollsAnsweredCount + selectedBet) / (pollsAnsweredCount + 1);

		return {
			previousBettingAverage: previousAverage,
			newBettingAverage: newAverage.toFixed(1),
		};
	} catch (error) {
		console.error("Error calculating betting average:", error);
		return {
			previousBettingAverage: "0.0",
			newBettingAverage: "0.0",
		};
	}
};
