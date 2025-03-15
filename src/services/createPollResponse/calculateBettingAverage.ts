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
		return "0.0";
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

export const getBettingAverage = async ({
	userId,
	selectedBet,
}: CalculateBettingAverageFn): Promise<CalculateBettingAverageFnResult> => {
	try {
		// Get previous betting average
		const previousAverage = await getPreviousBettingAverage(userId);
		const previousAverageNumber = Number(previousAverage);

		// Calculate new betting average correctly
		const newAverageNumber = selectedBet
			? (previousAverageNumber + Number(selectedBet)) / 2
			: previousAverageNumber;

		return {
			previousBettingAverage: previousAverageNumber.toFixed(1),
			newBettingAverage: newAverageNumber.toFixed(1),
		};
	} catch (error) {
		console.error("Error calculating betting average:", error);
		return {
			previousBettingAverage: "0.0",
			newBettingAverage: "0.0",
		};
	}
};
