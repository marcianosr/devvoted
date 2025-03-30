import { Poll } from "@/types/db";
import { SupabaseClient } from "@supabase/supabase-js";
import {
	createPollResponse,
	createPollResponseOptions,
} from "./createPollResponse";
import { getPollOptions } from "./getPollOptions";

type EvaluatePollResponseRequest = {
	supabase: SupabaseClient;
	poll: Poll;
	userId: string;
	selectedOptions: string[];
};

export const evaluatePollResponse = async ({
	supabase,
	poll,
	userId,
	selectedOptions,
}: EvaluatePollResponseRequest) => {
	const response = await createPollResponse(supabase, poll.id, userId); // Creates columns: poll_id, user_id
	await createPollResponseOptions(response.response_id, selectedOptions); // Creates columns: response_id, option_id
	const pollOptions = await getPollOptions({
		supabase,
		pollId: poll.id,
	}); // Creates columns: poll_id, option_id

	const correctOptions = pollOptions.filter((opt) => opt.is_correct);
	const hasIncorrectOption = selectedOptions.some((selectedId) => {
		const option = pollOptions.find((opt) => opt.id === Number(selectedId));
		return option && !option.is_correct;
	});
	const hasAllCorrectOptionsSelected = correctOptions.every((correctOpt) =>
		selectedOptions.includes(correctOpt.id.toString())
	);

	return {
		hasIncorrectOption,
		hasAllCorrectOptionsSelected,
	};
};
