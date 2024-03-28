import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "primereact/button";
import { PollDropdown } from "../components/PollDropdown";
import { InputText } from "primereact/inputtext";
import { PollTagsField } from "../components/PollTagsField";
import { PollAnswerField } from "../components/PollAnswerField";
import { PollDifficultySlider } from "../components/PollDifficultySlider";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";

const PageLayout = ({ children }) => {
  return <div className="bg-stone-100 dark:bg-stone-600 p-8">{children}</div>;
};

const meta: Meta<typeof PageLayout> = {
  component: PageLayout,
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Screen: Story = {
  render: () => (
    <PageLayout>
      <h1 className="text-5xl font-bold dark:text-white">Create poll</h1>

      <PollDropdown />

      {/* Dynamic PageLayout rendering based on selected poll type*/}
      <section className="mt-10">
        <h2 className="text-3xl font-bold dark:text-white">
          Regular question settings
        </h2>
        <article className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="poll-question">Poll question</label>
            <InputText
              type="text"
              id="poll-question"
              aria-describedby="aria-poll-question"
              placeholder="A question you can provide any time, kudo’s if you can do it in rhyme!"
            />
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
        <h2 className="text-3xl font-bold dark:text-white">Extra settings</h2>

        <section className="flex flex-col gap-2 mb-2">
          <label htmlFor="sandbox-url">Sandbox URL</label>
          <InputText type="url" placeholder="URL to sandbox" />
          <label htmlFor="code-example">Code example</label>
          <InputTextarea placeholder="Code example" rows={10} cols={30} />
        </section>
      </section>

      <Button label="Create Poll" />
    </PageLayout>
  ),
};
