import { InputText } from "primereact/inputtext";

export const PollQuestion = () => {
  return (
    <>
      <label htmlFor="poll-question">Poll question</label>
      <InputText
        type="text"
        id="poll-question"
        aria-describedby="aria-poll-question"
        placeholder="A question you can provide any time, kudo’s if you can do it in rhyme!"
      />
    </>
  );
};
