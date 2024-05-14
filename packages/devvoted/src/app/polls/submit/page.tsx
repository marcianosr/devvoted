import { redirect } from "next/navigation";
import { SubmitPollPage } from "@devvoted/ui";
import { fetchUserDetails } from "@/app/lib/user";
import { createPoll } from "@/app/lib/poll";
import { Poll } from "@/app/lib/types";

const SubmitPage: React.FC = () => {
  const handleSubmit = async (data: FormData) => {
    "use server";

    const userId = (await fetchUserDetails()).profileId;
    const formData = {
      pollType: data.get("poll-type"),
      pollQuestion: data.get("poll-question"),
      pollQuestionDescription: data.get("poll-question-description"),
      pollTags: data.getAll("poll-tags"),
      pollAnswers: data.getAll("poll-answers"),
      pollDifficulty: data.get("poll-difficulty"),
      userId,
    };

    const { id } = await createPoll(formData as Poll); // Not sure if this is correct way of casting?

    redirect(`/polls/${id}`);
  };
  return (
    <>
      {/* If in edit modus, render form with values */}
      <form action={handleSubmit}>
        <SubmitPollPage />
      </form>
    </>
  );
};

export default SubmitPage;
