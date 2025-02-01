import type { Poll, RawPoll } from "@/types/database";

export const getPoll = async (pollId: string): Promise<Poll | null> => {};

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
	return {
		success: true,
	};
};
