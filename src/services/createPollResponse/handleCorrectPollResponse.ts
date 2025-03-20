import { pollUserPerformanceTable } from "@/database/schema";
import { calculateBetXP } from "../calculateXP";
import {
	getRunDataByCategoryCode,
	updateActiveRunByCategoryCode,
} from "./runDataByCategory";
import { and, eq } from "drizzle-orm";
import { db } from "@/database/db";
import { getStreakMultiplierIncreaseForBet } from "../multipliers";

export const handleCorrectPollResponse = async ({
	selectedBet,
	userId,
	categoryCode,
}: {
	selectedBet: number;
	userId: string;
	categoryCode: string;
}) => {
	const previousData = await getRunDataByCategoryCode(userId, categoryCode);
	const currentMultiplier = Number(previousData?.streak_multiplier) || 0;
	
	// Get streak multiplier increase based on betting percentage
	const multiplierIncrease = getStreakMultiplierIncreaseForBet(selectedBet);
	
	// Calculate new multiplier with the dynamic increase
	const newMultiplier = (
		currentMultiplier + multiplierIncrease
	).toFixed(1);

	const currentXP = previousData?.temporary_xp ?? 0;
	const xpCalculation = calculateBetXP({
		availableXP: currentXP,
		betPercentage: selectedBet,
		streakMultiplier: Number(newMultiplier),
	});

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
