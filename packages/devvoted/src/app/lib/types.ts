type Question = {};

type User = {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean | null;
};

export type Poll = {
  userId: string;
  pollType: string;
  pollTags: string[];
  pollAnswers: string[];
  pollDifficulty: (typeof POLL_DIFFICULTIES)[number];
  pollQuestion: string;
  pollQuestionDescription: string;
};

export const POLL_DIFFICULTIES = [
  "very easy",
  "easy",
  "medium",
  "hard",
  "insane",
] as const;

export type CreatePollResult = {
  id: string;
};
