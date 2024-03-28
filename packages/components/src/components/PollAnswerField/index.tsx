import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

export const PollAnswerField = () => {
  const [answers, setAnswers] = useState<string[]>([""]);

  return (
    <section>
      <div className="flex flex-col gap-2">
        <label htmlFor="poll-answers">Answer</label>
        <small>Atleast 2 answers should be provided</small>
      </div>

      <div className="flex flex-col gap-2">
        {answers.map((answer, index) => (
          <div className="flex items-center gap-2">
            <span>{index + 1}</span>
            <InputText
              type="text"
              placeholder={`Answer #${index + 1}`}
              className="flex-1"
            />
            <Button label="✅" />
            <Button label="Add explanation" />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button
          label="Add answer"
          onClick={() => setAnswers([...answers, ""])}
        />
      </div>
    </section>
  );
};
