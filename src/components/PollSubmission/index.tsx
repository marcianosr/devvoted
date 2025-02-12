"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Text from "@/components/ui/Text";
import {
	PollSubmissionProps,
	SubmitPollResponseParams,
} from "@/components/PollSubmission/types";
import { ClosedPollMessage } from "@/components/PollSubmission/ClosedPollMessage";
import { PollOptions } from "@/components/PollSubmission/PollOptions";
import { SubmitButton } from "@/components/PollSubmission/SubmitButton";

const PollSubmission = ({ poll, options, user }: PollSubmissionProps) => {
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
		return <ClosedPollMessage />;
	}

	const handleOptionClick = (optionId: string) => {
		if (!user || isPollClosed) return;

		setSelectedOptions((prev) => {
			const isSelected = prev.includes(optionId);
			return isSelected
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId];
		});
		setError(null);
	};

	const handleSubmit = () => {
		if (!user || poll.status !== "open" || selectedOptions.length === 0)
			return;

		setError(null);

		submitPoll({
			pollId: poll.id.toString(),
			userId: user.id,
			selectedOptions,
		});
	};

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<Text className="mb-2">Select one or more options:</Text>
				<PollOptions
					options={options}
					selectedOptions={selectedOptions}
					onOptionClick={handleOptionClick}
				/>

				{error && (
					<div className="border border-red-500 rounded-lg p-4">
						<Text variant="error">{error}</Text>
					</div>
				)}
			</div>
			<SubmitButton
				isPending={isPending}
				isPollClosed={isPollClosed}
				user={user}
				hasSelectedOptions={selectedOptions.length > 0}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default PollSubmission;
