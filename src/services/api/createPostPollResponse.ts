import { Poll } from "@/types/db";

export type PollResponseResult = {
	success: boolean;
	isCorrect: boolean;
	changes: {
		previousXP: number;
		newXP: number;
		xpGain: number;
		previousMultiplier: number;
		newMultiplier: number;
		previousStreak: number;
		newStreak: number;
	};
};

export type CreatePostPollResponseRequest = {
	poll: Poll;
	userId: string;
	selectedOptions: string[];
	selectedBet: number;
};

export const createPostPollResponse = async (
	data: CreatePostPollResponseRequest
): Promise<PollResponseResult> => {
	const response = await fetch("/api/polls/submit-response", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to submit poll response");
	}

	return response.json();
};
