import { Button } from "primereact/button";

const SubmitPage: React.FC = () => {
  return (
    <>
      <h1>Hello there!</h1>
      {/* If in edit modus, render form with values */}
      <p>Let's submit a poll!</p>
      <Button label="Submit" />
    </>
  );
};

export default SubmitPage;
