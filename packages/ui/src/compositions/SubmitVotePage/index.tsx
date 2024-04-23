import { Button } from "primereact/button";
import { PageLayout } from "../../components/PageLayout";
import { Panel } from "primereact/panel";
import { RadioButton } from "primereact/radiobutton";

const options = [
  {
    id: "option1",
    label: "Option 1",
    value: "option1",
  },
  {
    id: "option2",
    label: "Option 2",
    value: "option2",
  },
  {
    id: "option3",
    label: "Option 3",
    value: "option3",
  },
  {
    id: "option4",
    label: "Option 4",
    value: "option4",
  },
  {
    id: "option5",
    label: "Option 5",
    value: "option5",
  },
  {
    id: "option6",
    label: "Option 6",
    value: "option6",
  },
  {
    id: "option7",
    label: "Option 7",
    value: "option7",
  },
];

export const SubmitVotePage = () => {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">
        This is a new question in our poll app that we rewrote, make sure to
        vote!
      </h1>

      <Panel className="p-4" header="This poll is worth 6 points!">
        <ul className="flex gap-4 flex-wrap">
          {options.map((option) => (
            <li className="flex gap-4" key={option.id}>
              <label htmlFor={option.id}>{option.label}</label>
              <RadioButton
                inputId={option.id}
                name="option"
                value={option.value}
              />
            </li>
          ))}
        </ul>
        <Button label="Vote" className="mt-4" />
      </Panel>
    </PageLayout>
  );
};
