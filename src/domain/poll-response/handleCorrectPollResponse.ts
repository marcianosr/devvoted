import { pollUserPerformanceTable } from "@/database/schema";
import { calculateBetXP } from "../score-calculation/calculateXP";
import {
	getRunDataByCategoryCode,
	updateActiveRunByCategoryCode,
} from "../run/runDataByCategory";
import { and, eq } from "drizzle-orm";
import { db } from "@/database/db";
import {
	getStreakMultiplierIncreaseForBet,
	DEFAULT_MULTIPLIER,
	MIN_STREAK_MULTIPLIER,
	MAX_STREAK_MULTIPLIER,
} from "../score-calculation/multipliers";

type CorrectPollResponseParams = {
	selectedBet: number;
	userId: string;
	categoryCode: string;
	calculatedXP?: number; // Optional parameter for pre-calculated XP
};

export const handleCorrectPollResponse = async ({
	selectedBet,
	userId,
	categoryCode,
	calculatedXP,
}: CorrectPollResponseParams) => {
	const previousData = await getRunDataByCategoryCode(userId, categoryCode);

	// If no previous data exists, start with the default multiplier
	const currentMultiplier =
		Number(previousData?.streak_multiplier) || DEFAULT_MULTIPLIER;

	// Get streak multiplier increase based on betting percentage
	const multiplierIncrease = getStreakMultiplierIncreaseForBet(selectedBet);

	// Calculate new multiplier with the dynamic increase
	// This accumulates over time as the user answers correctly in this category
	let newMultiplierValue = currentMultiplier + multiplierIncrease;

	// Apply min/max constraints
	newMultiplierValue = Math.max(
		MIN_STREAK_MULTIPLIER,
		Math.min(MAX_STREAK_MULTIPLIER, newMultiplierValue)
	);

	const newMultiplier = newMultiplierValue.toFixed(1);

	const currentXP = previousData?.temporary_xp ?? 0;

	// Use pre-calculated XP if provided, otherwise calculate it here
	let totalXPToAdd: number;

	if (calculatedXP !== undefined) {
		// Use the pre-calculated XP value
		totalXPToAdd = calculatedXP;
	} else {
		// Calculate XP if not provided (backward compatibility)
		const xpCalculation = calculateBetXP({
			availableXP: currentXP,
			betPercentage: selectedBet,
			streakMultiplier: Number(newMultiplier),
		});
		totalXPToAdd = xpCalculation.totalXP;
	}

	await updateActiveRunByCategoryCode(
		{
			user_id: userId,
			temporary_xp: currentXP + totalXPToAdd,
			streak_multiplier: newMultiplier,
			last_poll_at: new Date(),
			current_streak: previousData ? previousData.current_streak + 1 : 1, // Start at 1 for first correct answer
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

		// Only update best_multiplier if new value is higher
		const bestMultiplier =
			Number(newMultiplier) > currentBestMultiplier
				? newMultiplier
				: userPerformanceData[0].best_multiplier;

		await db
			.update(pollUserPerformanceTable)
			.set({
				best_multiplier: bestMultiplier,
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
