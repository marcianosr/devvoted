"use client";

import { PropsWithChildren } from "react";
import { PrimeReactProvider } from "primereact/api";
import { devvotedTheme } from "@devvoted/components";
import { TestContextProvider } from "../components/TestContext";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TestContextProvider value={4}>
      <PrimeReactProvider value={{ pt: devvotedTheme }}>
        {children}
      </PrimeReactProvider>
    </TestContextProvider>
  );
};
