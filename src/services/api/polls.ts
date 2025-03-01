import { Poll } from "@/types/db";

export type SubmitPollResponseParams = {
	poll: Poll;
	userId: string;
	selectedOptions: string[];
	selectedBet: number;
};

export const submitPollResponse = async (
	data: SubmitPollResponseParams
): Promise<void> => {
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
