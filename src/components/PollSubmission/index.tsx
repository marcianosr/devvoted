"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Text from "@/components/ui/Text/Text";
import { PollSubmissionProps } from "@/components/PollSubmission/types";
import { ClosedPollMessage } from "@/components/PollSubmission/ClosedPollMessage";
import { PollOptions } from "@/components/PollSubmission/PollOptions";
import { SubmitButton } from "@/components/PollSubmission/SubmitButton";
import { BettingOptions } from "./BettingOptions";
import {
	createPostPollResponse,
	PollResponseResult,
} from "@/services/api/createPostPollResponse";
import { usePollResult } from "@/app/context/PollResultContext";

const PollSubmission = ({
	poll,
	options,
	user,
	userSelectedOptions = [],
}: PollSubmissionProps) => {
	const isPollClosed = poll.status !== "open";
	const hasResponded = userSelectedOptions.length > 0;
	const [selectedOptions, setSelectedOptions] = useState<string[]>(
		hasResponded ? userSelectedOptions : []
	);
	const [selectedBet, setSelectedBet] = useState<number>();
	const [error, setError] = useState<string | null>(null);
	const { setPollResult } = usePollResult();

	const queryClient = useQueryClient();
	const { mutate: submitPoll, isPending } = useMutation({
		mutationFn: createPostPollResponse,
		onSuccess: (data: PollResponseResult) => {
			queryClient.invalidateQueries({ queryKey: ["polls", poll.id] });
			setPollResult(data); // Update the context with the poll result
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
		if (!user || isPollClosed || hasResponded) return;

		setSelectedOptions((prev) => {
			const isSelected = prev.includes(optionId);
			return isSelected
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId];
		});
		setError(null);
	};

	const handleSubmit = () => {
		if (
			!user ||
			!selectedBet ||
			selectedOptions.length === 0 ||
			isPollClosed
		)
			return;

		setError(null);

		submitPoll({
			poll,
			userId: user.id,
			selectedOptions,
			selectedBet,
		});
	};

	return (
		<div className="space-y-8">
			{!hasResponded && (
				<BettingOptions
					onBetSelect={setSelectedBet}
					selectedBet={selectedBet}
				/>
			)}
			<div>
				{hasResponded ? (
					<Text>Your response has been recorded:</Text>
				) : (
					<Text>Select one or more options:</Text>
				)}
				<PollOptions
					options={options}
					selectedOptions={selectedOptions}
					onOptionClick={handleOptionClick}
					isReadOnly={hasResponded}
				/>

				{error && (
					<div>
						<Text variant="error">{error}</Text>
					</div>
				)}
			</div>

			{!hasResponded && (
				<SubmitButton
					isPending={isPending}
					isPollClosed={isPollClosed}
					user={user}
					hasSelectedOptions={selectedOptions.length > 0}
					hasSelectedBet={selectedBet !== undefined}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
};

export default PollSubmission;
