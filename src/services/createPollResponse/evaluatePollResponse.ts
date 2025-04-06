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
	// Create the response in the database
	const { response_id } = await createPollResponse(supabase, poll.id, userId);

	// Create the response options in the database
	await createPollResponseOptions(response_id, selectedOptions);

	// Get the poll options
	const pollOptions = await getPollOptions({
		supabase,
		pollId: poll.id,
	});

	// Determine if this is a single choice poll
	const isSingleChoice = poll.answer_type === "single";

	// Extract option data for evaluation
	const selectedOptionIds = selectedOptions.map((id) => Number(id));
	const correctOptions = pollOptions.filter((opt) => opt.is_correct);
	const correctOptionsCount = correctOptions.length;
	const correctOptionIds = correctOptions.map((opt) => opt.id);

	// Analyze selected options
	const selectedCorrectOptionsCount = selectedOptionIds.filter((id) =>
		correctOptionIds.includes(id)
	).length;

	const hasIncorrectOption = selectedOptionIds.some(
		(id) => !correctOptionIds.includes(id)
	);

	const hasAllCorrectOptionsSelected = correctOptionIds.every((id) =>
		selectedOptionIds.includes(id)
	);

	// Calculate correctness score using pure functions
	const calculateSingleChoiceScore = () =>
		!hasIncorrectOption && selectedCorrectOptionsCount > 0 ? 1 : 0;

	const calculateMultipleChoiceScore = () => {
		if (correctOptionsCount === 0) return 0;

		// Base score is the proportion of correct options selected
		const baseScore = selectedCorrectOptionsCount / correctOptionsCount;

		// If no incorrect options were selected, return the base score
		if (!hasIncorrectOption) return baseScore;

		// Calculate penalty for incorrect selections
		const incorrectSelections =
			selectedOptionIds.length - selectedCorrectOptionsCount;

		// Enhanced penalty calculation:
		// 1. Base penalty factor from incorrect selections
		const basePenaltyFactor = incorrectSelections / pollOptions.length;

		// 2. Additional penalty for selecting a high percentage of all available options
		// This discourages selecting all or most options to game the system
		const selectionRatio = selectedOptionIds.length / pollOptions.length;
		const selectionPenalty =
			selectionRatio >= 0.5 ? Math.pow(selectionRatio, 2) : 0;

		// 3. Combined penalty (capped to prevent negative scores)
		const totalPenalty = Math.min(1, basePenaltyFactor + selectionPenalty);

		// Apply penalty but ensure some credit for correct answers
		return Math.max(0, baseScore - totalPenalty);
	};

	// Determine the score based on poll type
	const correctnessScore = isSingleChoice
		? calculateSingleChoiceScore()
		: calculateMultipleChoiceScore();

	return {
		hasIncorrectOption,
		hasAllCorrectOptionsSelected,
		isSingleChoice,
		correctnessScore,
		correctOptionsCount,
		totalCorrectOptionsCount: correctOptionsCount,
		selectedCorrectOptionsCount,
		pollOptions,
	};
};
