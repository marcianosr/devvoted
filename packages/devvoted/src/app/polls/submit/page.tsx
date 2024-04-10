import { redirect } from "next/navigation";
import { Button } from "primereact/button";

const SubmitPage: React.FC = () => {
  return (
    <>
      <h1>Hello there!</h1>
      {/* If in edit modus, render form with values */}
      <p>Let's submit a poll!</p>
      <form
        action={async () => {
          "use server";
          redirect("/polls");
        }}
      >
        <Button label="Submit" />
      </form>
    </>
  );
};

export default SubmitPage;
