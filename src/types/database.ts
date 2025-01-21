import type { Timestamp } from "firebase/firestore";

export type PollOption = {
	id: string;
	text: string;
	isCorrect: boolean;
};

export type PollStatus = "open" | "closed" | "needs-revision";
export type Response = {
	id: string;
	userId: string;
	selectedOptions: PollOption[];
	submittedAt: Timestamp;
};

export type Poll = {
	id: string;
	pollNumber: number;
	categories: string[]; // Should be hardcoded? 
	question: string;
	options: PollOption[];
	status: PollStatus;
	openingTime: Timestamp;
	closingTime: Timestamp;
	responses: Response[];
};

export type UserRole = "user" | "admin";

export type User = {
	id: string;
	displayName: string;
	email: string;
	photoURL: string;
	roles: UserRole[];
	totalPollsSubmitted: number;
	responses: string[];
};
