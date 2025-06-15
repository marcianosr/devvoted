import {
	resetActiveRunByAllCategories,
	resetActiveRunByCategoryCode,
} from "@/domain/run/resetRun";
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
}): Promise<{ newXP: number }> => {
	const { newXP } = await resetActiveRunByCategoryCode({
		supabase,
		userId,
		categoryCode,
		selectedBet,
	});

	await decreaseAttemptsForUser({
		supabase,
		userId,
	});

	return { newXP };
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
