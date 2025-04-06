import { and, eq } from "drizzle-orm";
import {
	resetActiveRunByAllCategories,
	resetActiveRunByCategoryCode,
} from "@/services/resetRun";
import { pollUserPerformanceTable } from "@/database/schema";
import { db } from "@/database/db";
import { SupabaseClient } from "@supabase/supabase-js";

export const handleWrongPollResponse = async ({
	supabase,
	userId,
	categoryCode,
	selectedBet = 100, // Default to 100% if not provided
}: {
	supabase: SupabaseClient;
	userId: string;
	categoryCode: string;
	selectedBet?: number;
}): Promise<{ newDevvotedScore: number; newXP: number }> => {
	const { newXP } = await resetActiveRunByCategoryCode({
		supabase,
		userId,
		categoryCode,
		selectedBet,
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

	// Default to 0 if no performance data exists
	const currentDevvotedScore = userPerformanceData.length > 0
		? Number(userPerformanceData[0].devvoted_score) || 0
		: 0;

	// For wrong answers, slightly decrease the devvoted_score (minimum 0)
	// This is a simplified calculation that can be replaced with a more complex algorithm later
	const newDevvotedScore = Math.max(0, currentDevvotedScore - 0.5);
	console.log(`Decreasing DevVoted score from ${currentDevvotedScore} to ${newDevvotedScore}`);

	// We no longer update the devvoted_score here, as it will be updated in createPollResponse
	// This prevents duplicate updates and ensures consistency

	await decreaseAttemptsForUser({
		supabase,
		userId,
	});

	// Return the new decreased score and new XP
	return { newDevvotedScore, newXP };
};

const decreaseAttemptsForUser = async ({
	supabase,
	userId,
}: {
	supabase: SupabaseClient;
	userId: string;
}) => {
	const { data: user, error } = await supabase
		.from("users")
		.select("run_attempts")
		.eq("id", userId)
		.single();

	// Improved error handling
	if (error) {
		throw new Error(`Error fetching user attempts: ${error.message}`);
	}

	if (!user) {
		throw new Error(`User not found with ID: ${userId}`);
	}

	// Default to 0 if run_attempts is null or undefined
	const currentAttempts = user.run_attempts ?? 0;
	const newAttempts = Math.max(currentAttempts - 1, 0);

	await supabase
		.from("users")
		.update({ run_attempts: newAttempts })
		.eq("id", userId);

	if (newAttempts === 0) {
		await resetActiveRunByAllCategories({ supabase, userId });
	}
};
