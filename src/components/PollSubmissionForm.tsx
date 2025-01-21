"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Poll } from "@/types/database";
import { submitPollResponse } from "@/services/polls";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import classNames from "classnames";

type Props = {
	poll: Poll;
};

export function PollSubmissionForm({ poll }: Props) {
	const { user } = useAuth();
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleOptionClick = (optionId: string) => {
		if (!user || poll.status !== "open") return;

		setSelectedOptions((prev) => {
			console.log(prev);
			// For now, only allow single selection
			return [optionId];
		});
		setError(null);
	};

	const handleSubmit = async () => {
		if (!user || poll.status !== "open" || selectedOptions.length === 0)
			return;

		setSubmitting(true);
		setError(null);

		try {
			await submitPollResponse(poll.id, user.uid, selectedOptions);
			// Clear selection after successful submission
			setSelectedOptions([]);
		} catch (err) {
			console.error("Error submitting response:", err);
			setError(
				err instanceof Error ? err.message : "Failed to submit response"
			);
		} finally {
			setSubmitting(false);
		}
	};

	const isPollClosed = poll.status !== "open";
	const isOptionSelected = (optionId: string) =>
		selectedOptions.includes(optionId);

	if (isPollClosed) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<Text>This poll is no longer accepting responses.</Text>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<Text>Please sign in to participate in this poll.</Text>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{poll.options.map((option) => (
					<button
						key={option.id}
						onClick={() => handleOptionClick(option.id)}
						className={classNames(
							"w-full p-4 text-left border rounded-lg transition-colors",
							{
								"bg-blue-50 border-blue-200": isOptionSelected(
									option.id
								),
								"hover:bg-gray-50": !isOptionSelected(
									option.id
								),
							}
						)}
					>
						<Text as="span">{option.text}</Text>
					</button>
				))}
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<Text>{error}</Text>
				</div>
			)}

			<div className="flex justify-end">
				<Button
					onClick={handleSubmit}
					disabled={selectedOptions.length === 0 || submitting}
					variant="primary"
				>
					{submitting ? "Submitting..." : "Submit"}
				</Button>
			</div>
		</div>
	);
}
