import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Button label="Button" />,
};

export const Group: Story = {
  render: () => (
    <ButtonGroup>
      <Button label="Button" />
      <Button label="Button" outlined />
    </ButtonGroup>
  ),
};
