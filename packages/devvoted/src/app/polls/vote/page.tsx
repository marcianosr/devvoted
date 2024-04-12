import { SubmitVotePage } from "@devvoted/ui";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";

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
        <Button label="Vote" />
      </form>
    </>
  );
};

export default VotePage;
