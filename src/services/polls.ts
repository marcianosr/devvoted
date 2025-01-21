import {
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
	increment,
	runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Poll } from "@/types/database";

export const getPoll = async (pollId: string): Promise<Poll | null> => {
	try {
		console.log("Fetching poll from Firestore emulator:", pollId);
		const pollRef = doc(db, "polls", pollId);
		const pollSnap = await getDoc(pollRef);

		console.log("Poll data:", pollSnap.data());

		if (!pollSnap.exists()) {
			console.log("Poll not found");
			return null;
		}

		return pollSnap.data() as Poll;
	} catch (error) {
		console.error("Error fetching poll:", error);
		throw error;
	}
};

export const submitPollResponse = async (
	pollId: string,
	userId: string,
	selectedOptionIds: string[]
) => {
	if (!selectedOptionIds.length) {
		throw new Error("At least one option must be selected");
	}

	const pollRef = doc(db, "polls", pollId);
	const userRef = doc(db, "users", userId);

	try {
		// Use a transaction to ensure data consistency
		await runTransaction(db, async (transaction) => {
			const pollDoc = await transaction.get(pollRef);
			const userDoc = await transaction.get(userRef);

			console.log("sr", userDoc.data());

			if (!pollDoc.exists()) {
				throw new Error("Poll not found");
			}

			const pollData = pollDoc.data() as Poll;

			if (pollData.status !== "open") {
				throw new Error("This poll is no longer accepting responses");
			}

			// Check if options exist in the poll
			const validOptions = selectedOptionIds.every((optionId) =>
				pollData.options.some((option) => option.id === optionId)
			);

			if (!validOptions) {
				throw new Error("Invalid option selected");
			}

			// Update user document
			transaction.update(userRef, {
				responses: arrayUnion(pollId),
				totalPollsSubmitted: increment(1),
			});

			// Create response document
			const responseRef = doc(db, "polls", pollId, "responses", userId);
			transaction.set(responseRef, {
				userId,
				selectedOptions: selectedOptionIds,
				submittedAt: new Date(),
			});
		});

		return { success: true };
	} catch (error) {
		console.error("Error submitting poll response:", error);
		throw error;
	}
};
