"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Text from "@/components/ui/Text/Text";
import { PollSubmissionProps } from "@/domain/poll/submission/types";
import { ClosedPollMessage } from "@/domain/poll/submission/components/ClosedPollMessage";
import { PollOptions } from "@/domain/poll/options/components/PollOptions";
import { SubmitButton } from "@/domain/poll/submission/components/SubmitButton";
import { BettingOptions } from "./BettingOptions";
import { createPostPollResponse } from "@/domain/api/createPostPollResponse";
import { usePollResult } from "@/app/context/PollResultContext";
import { BuildPollResult } from "@/domain/poll-result/buildPollResult";
import Shop from "@/domain/shop/components/Shop";

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
	const [showShop, setShowShop] = useState<boolean>(false);
	const { setPollResult } = usePollResult();

	const queryClient = useQueryClient();
	const { mutate: submitPoll, isPending } = useMutation({
		mutationFn: createPostPollResponse,
		onSuccess: (data: BuildPollResult) => {
			console.log("PollResponseResult", data);
			// Invalidate both the poll data and the user performance data
			queryClient.invalidateQueries({ queryKey: ["polls", poll.id] });
			queryClient.invalidateQueries({
				queryKey: ["userPerformance", user?.id, poll.category_code],
			});
			setPollResult(data); // Update the context with the poll result
			setShowShop(true); // Show the shop after successful submission
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

		console.log("submitting poll", {
			poll,
			userId: user.id,
			selectedOptions,
			selectedBet,
		});

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

			{/* Show the shop when showShop is true */}
			{showShop && <Shop onClose={() => setShowShop(false)} />}
		</div>
	);
};

export default PollSubmission;
