import { getPollById } from "@/app/lib/poll";

const PollPage: React.FC = async ({ params: { id } }) => {
  const poll = (await getPollById(id)) as Poll;

  return (
    <>
      <h1>{poll.pollQuestion}</h1>
      <small>{poll.pollQuestionDescription}</small>
    </>
  );
};

export default PollPage;
