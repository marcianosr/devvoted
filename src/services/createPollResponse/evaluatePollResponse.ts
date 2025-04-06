import { Poll, PollOption } from "@/types/db";
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

type EvaluatePollResponseResult = {
	hasIncorrectOption: boolean;
	hasAllCorrectOptionsSelected: boolean;
	isSingleChoice: boolean;
	correctnessScore: number; // 0-1 score representing correctness percentage
	correctOptionsCount: number;
	totalCorrectOptionsCount: number;
	selectedCorrectOptionsCount: number;
	pollOptions: PollOption[];
};

export const evaluatePollResponse = async ({
	supabase,
	poll,
	userId,
	selectedOptions,
}: EvaluatePollResponseRequest): Promise<EvaluatePollResponseResult> => {
	const response = await createPollResponse(supabase, poll.id, userId); // Creates columns: poll_id, user_id
	await createPollResponseOptions(response.response_id, selectedOptions); // Creates columns: response_id, option_id
	const pollOptions = await getPollOptions({
		supabase,
		pollId: poll.id,
	}); // Creates columns: poll_id, option_id

	// Determine if this is a single choice poll based on the poll's answer_type
	const isSingleChoice = poll.answer_type === 'single';

	// Find all correct options
	const correctOptions = pollOptions.filter((opt) => opt.is_correct);
	const totalCorrectOptionsCount = correctOptions.length;

	// Check if any incorrect options were selected
	const hasIncorrectOption = selectedOptions.some((selectedId) => {
		const option = pollOptions.find((opt) => opt.id === Number(selectedId));
		return option && !option.is_correct;
	});

	// Check if all correct options were selected
	const hasAllCorrectOptionsSelected = correctOptions.every((correctOpt) =>
		selectedOptions.includes(correctOpt.id.toString())
	);

	// Count how many correct options were selected
	const selectedCorrectOptionsCount = selectedOptions.reduce((count, selectedId) => {
		const option = pollOptions.find((opt) => opt.id === Number(selectedId));
		return option && option.is_correct ? count + 1 : count;
	}, 0);

	// Calculate correctness score (0-1)
	let correctnessScore = 0;

	if (isSingleChoice) {
		// For single choice: it's either 100% correct or 0% correct
		correctnessScore = (!hasIncorrectOption && hasAllCorrectOptionsSelected) ? 1 : 0;
	} else {
		// For multiple choice: calculate partial credit based on correct selections
		if (totalCorrectOptionsCount > 0) {
			// Base score is the proportion of correct options selected
			const baseScore = selectedCorrectOptionsCount / totalCorrectOptionsCount;
			
			// If incorrect options were selected, apply a penalty
			// but still give some credit for correct selections
			if (hasIncorrectOption) {
				// Calculate penalty based on proportion of incorrect selections
				const incorrectSelections = selectedOptions.length - selectedCorrectOptionsCount;
				const totalOptions = pollOptions.length;
				
				// Penalty factor: more incorrect selections = higher penalty
				const penaltyFactor = incorrectSelections / totalOptions;
				
				// Apply penalty but ensure some credit for correct answers
				correctnessScore = Math.max(0, baseScore - penaltyFactor);
			} else {
				// No incorrect options selected, full credit for correct selections
				correctnessScore = baseScore;
			}
		}
	}

	return {
		hasIncorrectOption,
		hasAllCorrectOptionsSelected,
		isSingleChoice,
		correctnessScore,
		correctOptionsCount: totalCorrectOptionsCount,
		totalCorrectOptionsCount,
		selectedCorrectOptionsCount,
		pollOptions
	};
};
