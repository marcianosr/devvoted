import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "./api/createPostPollResponse";
import { InsertActiveRun, UpdateActiveRun } from "@/types/db";

// Not sure where to put this file, as it is inserting data triggerd by /api/submit-response
export const createPollResponse = async (
	supabase: SupabaseClient,
	pollId: number,
	userId: string
) => {
	const { data: response, error } = await supabase
		.from("polls_responses")
		.insert([
			{
				poll_id: pollId,
				user_id: userId,
			},
		])
		.select()
		.single();

	if (error)
		throw new Error(`Error creating poll response: ${error.message}`);
	return response;
};

export const createPollResponseOptions = async (
	supabase: SupabaseClient,
	responseId: number,
	selectedOptions: string[]
) => {
	const responseOptions = selectedOptions.map((optionId: string) => ({
		response_id: responseId,
		option_id: optionId,
	}));

	const { error } = await supabase
		.from("polls_response_options")
		.insert(responseOptions);

	if (error)
		throw new Error(`Error creating response options: ${error.message}`);
};

export const getPreviousStreak = async (
	supabase: SupabaseClient,
	userId: string
) => {
	const { data: prevRun } = await supabase
		.from("active_runs")
		.select("streak_multiplier")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	return prevRun?.streak_multiplier ?? 0;
};

export const calculateXP = (bet: number) => bet;

export const updateActiveRun = async (
	supabase: SupabaseClient,
	activeRun: UpdateActiveRun
) => {
	const { error } = await supabase.from("active_runs").upsert([activeRun]);

	if (error) throw new Error(`Error creating active run: ${error.message}`);
};

export const DEFAULT_MULTIPLIER = 0.1;

export const createPostPollResponse = async ({
	poll,
	userId,
	selectedOptions,
	selectedBet,
}: CreatePostPollResponseRequest) => {
	const supabase = await createClient();

	try {
		// Create poll response
		const response = await createPollResponse(supabase, poll.id, userId);

		// Create response options
		await createPollResponseOptions(
			supabase,
			response.response_id,
			selectedOptions
		);

		// Get and update streak multiplier
		const prevMultiplier = await getPreviousStreak(supabase, userId);
		const newMultiplier = prevMultiplier + DEFAULT_MULTIPLIER;

		// update and find active run
		// await updateActiveRun(supabase, {
		// 	user_id: userId,
		// 	category_code: poll.category_code,
		// 	temporary_xp: calculateXP(selectedBet),
		// 	streak_multiplier: newMultiplier,
		// });

		return { success: true };
	} catch (error) {
		console.error("Error submitting poll response:", error);
		throw error;
	}
};
