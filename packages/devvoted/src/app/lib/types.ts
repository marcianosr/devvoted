type Question = {};

type User = {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean | null;
};

type Poll = {
  userId: string;
  pollQuestion: string;
  pollQuestionDescription: string;
};

type CreatePollResult = {
  id: string;
};
