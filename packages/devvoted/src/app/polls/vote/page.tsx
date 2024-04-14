import { SubmitVotePage } from "@devvoted/ui";
import { redirect } from "next/navigation";

const VotePage: React.FC = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          redirect("/polls/vote/2");
        }}
      >
        <SubmitVotePage />
      </form>
    </>
  );
};

export default VotePage;
