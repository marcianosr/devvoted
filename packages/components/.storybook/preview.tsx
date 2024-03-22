import React from "react";
import { Preview } from "@storybook/react";
import { PrimeReactProvider } from "primereact/api";
import "../src/index.css";
import "primereact/resources/themes/md-light-indigo/theme.css";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

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
      <PrimeReactProvider
        value={{
          pt: {
            button: {
              root: {
                className:
                  "bg-transparent border-2 border-blue-600 hover:border-blue-500 text-blue-600 hover:text-blue-500 border-dashed rounded-none box-shadow-md m-2",
              },
            },
          },
        }}
      >
        <Story />
      </PrimeReactProvider>
    ),
  ],
};

export default preview;
