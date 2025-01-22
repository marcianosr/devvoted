import type { Timestamp } from "firebase/firestore";

export type PollOption = {
	id: string;
	text: string;
	isCorrect: boolean;
};

export type PollStatus = "open" | "closed" | "needs-revision";
export type Response = {
	userId: string;
	selectedOptions: PollOption[];
	submittedAt: Timestamp;
};

export type RawPoll = {
	id: string;
	pollNumber: number;
	categories: string[]; // Should be hardcoded?
	question: string;
	options: PollOption[];
	status: PollStatus;
	openingTime: Timestamp;
	closingTime: Timestamp;
};

export type Poll = Omit<RawPoll, "openingTime" | "closingTime"> & {
	openingTime: string;
	closingTime: string;
};

export type UserRole = "user" | "admin";

export type ClientUser = {
	id: string;
	displayName: string;
	email: string;
	photoURL: string;
	roles: UserRole[];
	totalPollsSubmitted: number;
	responses: Response[];
};
