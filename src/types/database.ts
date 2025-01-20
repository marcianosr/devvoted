import type { Timestamp } from "firebase/firestore";

export type PollOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type PollStatus = "open" | "closed" | "archived";

export type Poll = {
  id: string;
  pollNumber: number;
  categories: string[];
  question: string;
  options: PollOption[];
  status: PollStatus;
  openingTime: Timestamp;
  closingTime: Timestamp;
  totalResponses: number;
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
