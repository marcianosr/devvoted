import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import { PollQuestion, PollTagsField, SubmitPollPage } from "@devvoted/ui";

const SubmitPage: React.FC = () => {
  return (
    <>
      <h1>Hello there!</h1>
      {/* If in edit modus, render form with values */}
      <form
        action={async () => {
          "use server";
          redirect("/polls");
        }}
      >
        <SubmitPollPage />
      </form>
    </>
  );
};

export default SubmitPage;
