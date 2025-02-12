"use client";

import { useState } from "react";
import classNames from "classnames";
import { Poll, PollOption } from "@/types/db";
import { User } from "@supabase/supabase-js";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
	poll: Poll;
	options: PollOption[];
	user: User | null;
};

type SubmitPollResponseParams = {
	pollId: string;
	userId: string;
	selectedOptions: string[];
};

export default function PollSubmission({ poll, options, user }: Props) {
	const isPollClosed = poll.status !== "open";
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	const queryClient = useQueryClient();
	const { mutate: submitPoll, isPending } = useMutation({
		mutationFn: async (data: SubmitPollResponseParams) => {
			const response = await fetch("/api/polls/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(
					error.error || "Failed to submit poll response"
				);
			}

			return response.json();
		},
		onSuccess: () => {
			setSelectedOptions([]);
			queryClient.invalidateQueries({ queryKey: ["polls", poll.id] });
		},
		onError: (err: Error) => {
			setError(err.message);
			console.error("Error submitting poll:", err);
		},
	});

	if (isPollClosed) {
		return (
			<div className="border border-yellow-500 rounded-lg p-4">
				<Text variant="warning">
					This poll is no longer accepting responses.
				</Text>
			</div>
		);
	}

	const handleOptionClick = (optionId: string) => {
		if (!user || isPollClosed) return;

		setSelectedOptions((prev) => {
			// For now, only allow single selection
			return [optionId];
		});
		setError(null);
	};

	const handleSubmit = () => {
		if (!user || poll.status !== "open" || selectedOptions.length === 0)
			return;

		setError(null);

		submitPoll({
			pollId: poll.id,
			userId: user.id,
			selectedOptions,
		});
	};

	const isOptionSelected = (optionId: string) =>
		selectedOptions.includes(optionId);

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{options.map((option) => (
					<button
						key={option.id}
						onClick={() => handleOptionClick(option.id)}
						className={classNames(
							"w-full p-4 text-left border rounded-lg transition-colors",
							{
								"border-purple-600 bg-purple-600 bg-opacity-20":
									isOptionSelected(option.id),
								"bg-white bg-opacity-0 hover:bg-opacity-20":
									!isOptionSelected(option.id),
							}
						)}
					>
						<Text as="span">{option.option}</Text>
					</button>
				))}

				{error && (
					<div className="border border-red-500 rounded-lg p-4">
						<Text variant="error">{error}</Text>
					</div>
				)}
			</div>
			<div className="flex justify-end">
				<Button
					onClick={handleSubmit}
					disabled={
						isPollClosed ||
						!user ||
						selectedOptions.length === 0 ||
						isPending
					}
					variant="primary"
				>
					{isPending ? "Submitting..." : "Submit"}
				</Button>
			</div>
		</div>
	);
}
