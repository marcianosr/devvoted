import { redirect } from "next/navigation";
import { Button } from "primereact/button";

const VotePage: React.FC = () => {
  return (
    <>
      <h1>Your voting on poll id #2</h1>
      <p>Let's vote!</p>
      <form
        action={async () => {
          "use server";

          redirect("/polls/vote/2");
        }}
      >
        <Button label="Vote" />
      </form>
    </>
  );
};

export default VotePage;
