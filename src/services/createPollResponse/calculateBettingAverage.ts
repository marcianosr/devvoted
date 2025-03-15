import { db } from "@/database/db";
import { pollUserPerformanceTable } from "@/database/schema";
import { eq } from "drizzle-orm";

// Calculate the betting average for a user in a specific category
type CalculateBettingAverageFn = {
	userId: string;
	selectedBet: number;
};

type CalculateBettingAverageFnResult = {
	newBettingAverage: string;
	previousBettingAverage: string;
};
// Fetches the previous betting average for a user
export const getPreviousBettingAverage = async (
	userId: string
): Promise<string> => {
	try {
		const data = await db
			.select()
			.from(pollUserPerformanceTable)
			.where(eq(pollUserPerformanceTable.user_id, userId))
			.limit(1);

		return data.length > 0 ? data[0].betting_average : "0.0";
	} catch (error) {
		console.error("Error fetching previous betting average:", error);
		return "0.0"; // Default value in case of an error
	}
};

// Calculates the new betting average
export const calculateNewBettingAverage = (
	previousBettingAverage: string,
	selectedBet: number
): CalculateBettingAverageFnResult => {
	const newBettingAverage = (
		(Number(previousBettingAverage) + Number(selectedBet)) /
		2
	).toFixed(1);

	return {
		newBettingAverage,
		previousBettingAverage,
	};
};

export const calculateBettingAverage = async ({
	userId,
	selectedBet,
}: CalculateBettingAverageFn): Promise<CalculateBettingAverageFnResult> => {
	const previousBettingAverage = await getPreviousBettingAverage(userId);
	return calculateNewBettingAverage(previousBettingAverage, selectedBet);
};
