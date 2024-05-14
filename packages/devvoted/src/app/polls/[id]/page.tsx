import { getPollById } from "@/app/lib/poll";
import { Poll } from "@/app/lib/types";

type PollPageQueryParams = {
  params: {
    id: string;
  };
};

const PollPage = async ({ params }: PollPageQueryParams) => {
  const { id } = params;
  const poll = (await getPollById(id)) as Poll;

  return (
    <>
      <h1>{poll.pollQuestion}</h1>
      <small>{poll.pollQuestionDescription}</small>
    </>
  );
};

export default PollPage;
