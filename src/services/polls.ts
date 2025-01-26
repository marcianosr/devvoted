import {
	doc,
	getDoc,
	arrayUnion,
	increment,
	runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Poll, RawPoll } from "@/types/database";

export const getPoll = async (pollId: string): Promise<Poll | null> => {
	try {
		console.log("Fetching poll from Firestore emulator:", pollId);
		const pollRef = doc(db, "polls", pollId);
		const pollSnap = await getDoc(pollRef);

		if (!pollSnap.exists()) {
			return null;
		}

		const rawPoll = pollSnap.data() as RawPoll;
		return serializeTimestamps(rawPoll);
	} catch (error) {
		console.error("Error fetching poll:", error);
		throw error;
	}
};

const serializeTimestamps = (poll: RawPoll): Poll => {
	return {
		...poll,
		openingTime: poll.openingTime.toDate().toISOString(),
		closingTime: poll.closingTime.toDate().toISOString(),
	};
};

export const submitPollResponse = async (
	pollId: string,
	userId: string,
	selectedOptions: string[]
) => {
	const pollRef = doc(db, "polls", pollId);
	const userRef = doc(db, "users", userId);

	return runTransaction(db, async (transaction) => {
		const pollDoc = await transaction.get(pollRef);
		const userDoc = await transaction.get(userRef);

		if (!pollDoc.exists()) {
			throw new Error("Poll not found");
		}

		if (!userDoc.exists()) {
			throw new Error("User not found");
		}

		const poll = pollDoc.data() as RawPoll;

		if (poll.status !== "open") {
			throw new Error("Poll is not open for responses");
		}

		// Validate selected options
		const validOptions = poll.options.map((opt) => opt.id);
		const invalidOptions = selectedOptions.filter(
			(opt) => !validOptions.includes(opt)
		);

		if (invalidOptions.length > 0) {
			throw new Error("Invalid option selected");
		}

		// Update poll document responses
		transaction.update(pollRef, {
			responses: {
				userId,
				selectedOptions: selectedOptions.map((optId) => optId),
				submittedAt: new Date(),
			},
			totalPollsSubmitted: increment(1),
		});

		return { success: true };
	}).catch((error) => {
		console.error("Error submitting poll response:", error);
		throw error;
	});
};
