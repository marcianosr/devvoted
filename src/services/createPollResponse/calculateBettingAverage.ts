import { db } from "@/database/db";
import {
	pollResponsesTable,
	pollUserPerformanceTable,
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

// Fetches the count of polls answered by a user
export const getPollsAnsweredCount = async (
	userId: string
): Promise<number> => {
	try {
		const responses = await db
			.select({ response_id: pollResponsesTable.response_id })
			.from(pollResponsesTable)
			.where(eq(pollResponsesTable.user_id, userId));

		return responses.length;
	} catch (error) {
		console.error("Error fetching polls answered count:", error);
		return 0;
	}
};

// Fetches the total sum of bets placed by a user
export const getTotalBetsSum = async (
	userId: string,
	selectedBet: number
): Promise<number> => {
	try {
		// For this implementation, we'll use a simpler approach:
		// We'll count the number of polls answered and multiply by the selected bet
		// This simulates the scenario where all previous bets were the same as the current one
		const pollsAnswered = await getPollsAnsweredCount(userId);

		// If this is the first poll, the total is just the selected bet
		if (pollsAnswered === 0) {
			return selectedBet;
		}

		// Otherwise, simulate as if all previous polls had the same bet amount
		return pollsAnswered * selectedBet;
	} catch (error) {
		console.error("Error calculating total bets sum:", error);
		return 0;
	}
};

// Fetches the previous betting average for a user
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
		const pollsAnsweredCount = await getPollsAnsweredCount(userId);

		return {
			previousBettingAverage: previousAverage,
			newBettingAverage: (Number(previousAverage) + selectedBet).toFixed(
				1
			),
		};
	} catch (error) {
		console.error("Error calculating betting average:", error);
		return {
			previousBettingAverage: "0.0",
			newBettingAverage: "0.0",
		};
	}
};
