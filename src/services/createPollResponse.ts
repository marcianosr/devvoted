import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "./api/createPostPollResponse";
import { UpdateActiveRun } from "@/types/db";

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

export const getPreviousStreakByCategoryCode = async (
	userId: string,
	categoryCode: string
) => {
	const supabase = await createClient();

	const { data: prevRun, error } = await supabase
		.from("active_runs")
		.select("streak_multiplier")
		.eq("user_id", userId)
		.eq("category_code", categoryCode);

	if (error)
		throw new Error(`Error getting previous streak: ${error.message}`);

	return prevRun;
};

export const calculateXP = (bet: number) => bet;

export const updateActiveRunByCategoryCode = async (
	activeRun: Partial<UpdateActiveRun>,
	categoryCode: string
) => {
	const supabase = await createClient();

	const { error } = await supabase
		.from("active_runs")
		.update(activeRun)
		.eq("category_code", categoryCode)
		.eq("user_id", activeRun.user_id);

	if (error) throw new Error(`Error creating active run: ${error.message}`);
};

export const DEFAULT_MULTIPLIER_INCREASE = 0.1;

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
		const prevMultiplier = await getPreviousStreakByCategoryCode(
			userId,
			poll.category_code
		);

		const currentMultiplier = Number(prevMultiplier) || 0;
		const newMultiplier = (
			currentMultiplier + DEFAULT_MULTIPLIER_INCREASE
		).toFixed(1);

		// update and find active run
		await updateActiveRunByCategoryCode(
			{
				user_id: userId,
				temporary_xp: calculateXP(selectedBet),
				streak_multiplier: newMultiplier,
			},
			poll.category_code
		);

		return { success: true };
	} catch (error) {
		console.error("Error submitting poll response:", error);
		throw error;
	}
};
