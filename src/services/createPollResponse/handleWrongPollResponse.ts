import { and, eq } from "drizzle-orm";
import {
	resetActiveRunByAllCategories,
	resetActiveRunByCategoryCode,
} from "./resetRun";
import { pollUserPerformanceTable } from "@/database/schema";
import { db } from "@/database/db";
import { SupabaseClient } from "@supabase/supabase-js";

export const handleWrongPollResponse = async ({
	supabase,
	userId,
	categoryCode,
}: {
	supabase: SupabaseClient;
	userId: string;
	categoryCode: string;
}) => {
	await resetActiveRunByCategoryCode({
		supabase,
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

	await decreaseAttemptsForUser({
		supabase,
		userId,
	});
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
	if (error || !user?.run_attempts)
		throw new Error(`Error fetching user attempts: ${error?.message}`);

	const newAttempts = Math.max(user.run_attempts - 1, 0);
	await supabase
		.from("users")
		.update({ run_attempts: newAttempts })
		.eq("id", userId);

	if (newAttempts === 0)
		await resetActiveRunByAllCategories({ supabase, userId });
};
