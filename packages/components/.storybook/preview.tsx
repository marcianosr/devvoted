import React from "react";
import { Preview } from "@storybook/react";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/md-light-indigo/theme.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <PrimeReactProvider>
        <Story />
      </PrimeReactProvider>
    ),
  ],
};

export default preview;
