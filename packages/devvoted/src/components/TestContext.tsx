"use client";

import { createContext, useContext } from "react";

const TestContext = createContext(0);

export const TestContextProvider = TestContext.Provider;

export const useTestContext = () => {
  return useContext(TestContext);
};
