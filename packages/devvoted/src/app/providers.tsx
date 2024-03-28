"use client";

import { PropsWithChildren } from "react";
import { PrimeReactProvider } from "primereact/api";
import { devvotedTheme } from "@devvoted/ui";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <PrimeReactProvider value={{ pt: devvotedTheme }}>
      {children}
    </PrimeReactProvider>
  );
};
