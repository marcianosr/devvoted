import type { Meta, StoryObj } from "@storybook/react";
import { SubmitPollPage } from "../compositions/SubmitPollPage";

const meta: Meta<typeof SubmitPollPage> = {
  component: SubmitPollPage,
};

export default meta;
type Story = StoryObj<typeof SubmitPollPage>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Screen: Story = {
  render: () => <SubmitPollPage />,
};
