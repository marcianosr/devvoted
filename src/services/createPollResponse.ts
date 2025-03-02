import { createClient } from "@/app/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostPollResponseRequest } from "./api/createPostPollResponse";
import { ActiveRun, PollOption, UpdateActiveRun } from "@/types/db";
import { calculateBetXP } from "./calculateXP";
import { START_MULTIPLIER_INCREASE } from "./constants";

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
	selectedOptions: PollOption[]
) => {
	const responseOptions = selectedOptions.map((optionId: PollOption) => ({
		response_id: responseId,
		option_id: optionId,
	}));

	const { error } = await supabase
		.from("polls_response_options")
		.insert(responseOptions);

	if (error)
		throw new Error(`Error creating response options: ${error.message}`);
};

export const getPreviousByCategoryCode = async (
	userId: string,
	categoryCode: string
): Promise<ActiveRun | null> => {
	const supabase = await createClient();

	const { data: prevRun, error } = await supabase
		.from("polls_active_runs")
		.select("*")
		.eq("user_id", userId)
		.eq("category_code", categoryCode)
		.limit(1)
		.maybeSingle<ActiveRun>();

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
		.from("polls_active_runs")
		.update(activeRun)
		.eq("category_code", categoryCode)
		.eq("user_id", activeRun.user_id);

	if (error) throw new Error(`Error creating active run: ${error.message}`);
};

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

		const hasIncorrectAnswer = true;

		if (hasIncorrectAnswer) {
			console.log("Incorrect answer");
			// await handleWrongPollResponse({
			// 	userId,
			// 	categoryCode: poll.category_code,
			// });
			// return;
		} else {
			console.log("Correct answer");
			// await handleCorrectPollResponse({
			// 	selectedBet,
			// 	userId,
			// 	categoryCode: poll.category_code,
			// });
		}

		return { success: true };
	} catch (error) {
		console.error("Error submitting poll response:", error);
		throw error;
	}
};

const handleCorrectPollResponse = async ({
	selectedBet,
	userId,
	categoryCode,
}: {
	selectedBet: number;
	userId: string;
	categoryCode: string;
}) => {
	// Get and update streak multiplier
	const previousData = await getPreviousByCategoryCode(userId, categoryCode);

	const currentMultiplier = Number(previousData?.streak_multiplier) || 0;
	const newMultiplier = (
		currentMultiplier + START_MULTIPLIER_INCREASE
	).toFixed(1);

	const currentXP = previousData?.temporary_xp ?? 0;
	const xpCalculation = calculateBetXP({
		availableXP: currentXP,
		betPercentage: selectedBet,
		streakMultiplier: Number(newMultiplier),
	});

	// update and find active run
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
};

const handleWrongPollResponse = async ({
	userId,
	categoryCode,
}: {
	userId: string;
	categoryCode: string;
}) => {
	await resetActiveRunByCategoryCode(userId, categoryCode);
};

const resetActiveRunByCategoryCode = async (
	userId: string,
	categoryCode: string
) => {
	const supabase = await createClient();

	const { error } = await supabase
		.from("polls_active_runs")
		.update({
			temporary_xp: 0,
			streak_multiplier: "0.0",
			last_poll_at: new Date(),
			current_streak: 0,
		})
		.eq("category_code", categoryCode)
		.eq("user_id", userId);

	if (error) throw new Error(`Error resetting active run: ${error.message}`);

	return { success: true };
};
