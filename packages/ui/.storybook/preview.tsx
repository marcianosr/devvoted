import React from "react";
import { Preview } from "@storybook/react";
import { PrimeReactProvider } from "primereact/api";
import "../src/index.css";
import "primereact/resources/themes/md-light-indigo/theme.css";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { devvotedTheme } from "../src/base-theme";

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-mode",
    }),
    (Story) => (
      <PrimeReactProvider value={{ pt: devvotedTheme }}>
        <Story />
      </PrimeReactProvider>
    ),
  ],
};

export default preview;
