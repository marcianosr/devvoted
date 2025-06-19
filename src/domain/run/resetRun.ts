import { GAME_OVER_XP, START_MULTIPLIER_INCREASE } from "../constants";
import { SupabaseClient } from "@supabase/supabase-js";

export const resetActiveRunByAllCategories = async ({
	supabase,
	userId,
}: {
	supabase: SupabaseClient;
	userId: string;
}) => {
	const { data, error: pollsActiveRunError } = await supabase
		.from("polls_active_runs")
		.update({
			status: "finished",
		})
		.eq("user_id", userId);

	if (pollsActiveRunError)
		throw new Error(
			`Error resetting active run: ${pollsActiveRunError.message}`
		);

	const { error: userError } = await supabase
		.from("users")
		.update({
			active_config: null,
		})
		.eq("id", userId);
	if (userError)
		throw new Error(`Error resetting active run: ${userError.message}`);

	return { success: true, current_run: data };
};

export const resetActiveRunByCategoryCode = async ({
	supabase,
	userId,
	categoryCode,
	selectedBet = 100, // Default to 100% if not provided (full reset)
}: {
	supabase: SupabaseClient;
	userId: string;
	categoryCode: string;
	selectedBet?: number;
}) => {
	// First get the current run data to calculate the XP loss
	const { data: currentRun, error: fetchError } = await supabase
		.from("polls_active_runs")
		.select("*")
		.eq("category_code", categoryCode)
		.eq("user_id", userId)
		.single();

	if (fetchError)
		throw new Error(`Error fetching active run: ${fetchError.message}`);

	// Calculate how much XP to deduct based on the bet percentage
	const currentXP = currentRun?.temporary_xp || GAME_OVER_XP;
	const xpToDeduct = Math.floor((currentXP * selectedBet) / 100);

	// Calculate the new XP value after the deduction
	// Ensure it doesn't go below the starting value
	const newXP = Math.max(GAME_OVER_XP, currentXP - xpToDeduct);

	// Update the run with the new XP value and reset other metrics
	const { error } = await supabase
		.from("polls_active_runs")
		.update({
			temporary_xp: newXP,
			current_streak: 0,
			streak_multiplier: START_MULTIPLIER_INCREASE,
			last_poll_at: new Date(),
			status: "completed",
		})
		.eq("category_code", categoryCode)
		.eq("user_id", userId);

	if (error) throw new Error(`Error resetting active run: ${error.message}`);

	return { success: true, newXP };
};
