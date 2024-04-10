"use client";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

const SubmitPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <h1>Hello there!</h1>
      {/* If in edit modus, render form with values */}
      <p>Let's submit a poll!</p>
      <Button
        label="Submit"
        onClick={() => {
          router.push("/polls");
        }}
      />
    </>
  );
};

export default SubmitPage;
