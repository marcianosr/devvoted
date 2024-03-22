import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "primereact/button";
import React from "react";

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
  render: () => (
    <div className="bg-stone-100 dark:bg-stone-600 p-8">
      <h2 className="bg-gradient-to-r from-blue-600 to-indigo-400 inline-block drop-shadow pb-2 font-bold text-5xl text-transparent bg-clip-text">
        The following property you may have seen, what is the behaviour of this
        property you'll see on the screen?
      </h2>
      <Button label="Answer possibility 1" />
      <Button label="Answer possibility 2" />
      <Button label="Answer possibility 3" />
    </div>
  ),
};
