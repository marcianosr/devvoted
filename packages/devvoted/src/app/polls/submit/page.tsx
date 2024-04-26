import { redirect } from "next/navigation";
import { SubmitPollPage } from "@devvoted/ui";
import { fetchUserDetails } from "@/app/lib/user";
import { createPoll } from "@/app/lib/poll";

const SubmitPage: React.FC = () => {
  const handleSubmit = async (data: FormData) => {
    "use server";

    const userId = (await fetchUserDetails()).profileId;
    const formData = {
      pollQuestion: data.get("poll-question"),
      pollQuestionDescription: data.get("poll-question-description"),
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
