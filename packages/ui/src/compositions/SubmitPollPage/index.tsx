import { Button } from "primereact/button";
import { PollDropdown } from "../../components/PollDropdown";
import { InputText } from "primereact/inputtext";
import { PollTagsField } from "../../components/PollTagsField";
import { PollAnswerField } from "../../components/PollAnswerField";
import { PollDifficultySlider } from "../../components/PollDifficultySlider";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { PollQuestion } from "../../components/PollQuestion";
import { PageLayout } from "../../components/PageLayout";

export const SubmitPollPage = () => {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Create poll</h1>

      <PollDropdown />

      {/* Dynamic PageLayout rendering based on selected poll type*/}
      <section className="mt-10">
        <h2 className="text-3xl font-bold">Regular question settings</h2>
        <article className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <PollQuestion />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="poll-question-description">Description</label>
            <InputText
              type="text"
              id="poll-question-description"
              aria-describedby="aria-poll-question-description"
              placeholder="A short description to elaborate if needed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="poll-question-descriptipn">Tags</label>
            <small>Select tags to assign categories to this poll</small>
            <PollTagsField
              suggestions={[
                { name: "React" },
                { name: "HTML" },
                { name: "CSS" },
                { name: "JavaScript" },
                { name: "Python" },
                { name: "Java" },
                { name: "TypeScript" },
                { name: "Git" },
                { name: "Django" },
                { name: "General Frontend" },
              ]}
            />
          </div>
          <PollAnswerField />
          <PollDifficultySlider />
        </article>
      </section>
      <Divider />

      <section>
        <h2 className="text-3xl font-bold">Extra settings</h2>

        <section className="flex flex-col gap-2 mb-2">
          <label htmlFor="sandbox-url">Sandbox URL</label>
          <InputText type="url" placeholder="URL to sandbox" />
          <label htmlFor="code-example">Code example</label>
          <InputTextarea placeholder="Code example" rows={10} cols={30} />
        </section>
      </section>
      <Button label="Create poll" />
    </PageLayout>
  );
};
