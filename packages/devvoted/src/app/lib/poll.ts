import { firestore } from "./firestore";
import { CreatePollResult, Poll } from "./types";

export const createPoll = async (data: Poll): Promise<CreatePollResult> => {
  const { userId, pollQuestion, pollQuestionDescription } = data;

  const poll = await firestore.collection("polls").add({
    userId,
    pollQuestion,
    pollQuestionDescription,
  });

  return {
    id: poll.id,
  };
};

export const getPollById = async (id: string) => {
  const poll = await firestore.collection("polls").doc(id).get();

  return poll.data();
};
