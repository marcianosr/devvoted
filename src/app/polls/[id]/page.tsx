"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Text, { SmallText } from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useEffect, useState } from "react";
import { getPoll, submitPollResponse } from "@/services/polls";
import type { Poll } from "@/types/database";

export default function PollPage() {
	const { user, loading: authLoading } = useAuth();
	const params = useParams();
	const pollId = params.id as string;

	const [poll, setPoll] = useState<Poll | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	useEffect(() => {
		async function loadPoll() {
			try {
				console.log("Loading poll:", pollId);
				const pollData = await getPoll(pollId);
				console.log("Loaded poll data:", pollData);
				setPoll(pollData);
			} catch (err) {
				console.error("Error loading poll:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load poll"
				);
			} finally {
				setLoading(false);
			}
		}

		loadPoll();
	}, [pollId]);

	const handleOptionClick = (optionId: string) => {
		if (!user || poll?.status !== "open") return;

		setSelectedOptions((prev) => {
			// For now, only allow single selection
			return [optionId];
		});
		setSubmitError(null);
	};

	const handleSubmit = async () => {
		if (!user || !poll || poll.status !== "open") return;

		setSubmitting(true);
		setSubmitError(null);

		try {
			await submitPollResponse(pollId, user.uid, selectedOptions);
			// Refresh poll data after submission
			const updatedPoll = await getPoll(pollId);
			setPoll(updatedPoll);
			setSelectedOptions([]);
		} catch (err) {
			console.error("Error submitting response:", err);
			setSubmitError(
				err instanceof Error ? err.message : "Failed to submit response"
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (authLoading || loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<Title as="h2">Error</Title>
					<Text>{error}</Text>
				</div>
			</div>
		);
	}

	if (!poll) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<Title as="h2">Poll Not Found</Title>
					<Text>The requested poll could not be found.</Text>
				</div>
			</div>
		);
	}

	const isPollClosed = poll.status !== "open";
	const isOptionSelected = (optionId: string) =>
		selectedOptions.includes(optionId);

	return (
		<section className="container mx-auto px-4 py-8 space-y-8">
			<Title as="h1">{poll.question}</Title>

			{isPollClosed && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<Text>This poll is no longer accepting responses.</Text>
				</div>
			)}

			<div className="space-y-4">
				{poll.options.map((option) => (
					<button
						key={option.id}
						onClick={() => handleOptionClick(option.id)}
						disabled={isPollClosed || !user}
						className={`w-full p-4 text-left border rounded-lg transition-colors ${
							isOptionSelected(option.id)
								? "bg-blue-50 border-blue-200"
								: "hover:bg-gray-50"
						} ${
							isPollClosed || !user
								? "opacity-75 cursor-not-allowed"
								: ""
						}`}
					>
						<Text as="span">{option.text}</Text>
					</button>
				))}
			</div>

			{submitError && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<Text>{submitError}</Text>
				</div>
			)}

			<div className="flex items-center justify-between">
				<SmallText>Total responses: {poll.responses.length}</SmallText>
				<Button
					onClick={handleSubmit}
					disabled={
						!user ||
						isPollClosed ||
						selectedOptions.length === 0 ||
						submitting
					}
					variant="primary"
				>
					{submitting ? "Submitting..." : "Submit"}
				</Button>
			</div>

			{!user && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<Text>Please sign in to participate in this poll.</Text>
				</div>
			)}
		</section>
	);
}
