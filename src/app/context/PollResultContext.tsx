"use client";

import { PollResponseResult } from "@/domain/api/createPostPollResponse";
import { createContext, useContext, useState, ReactNode } from "react";

type PollResultContextType = {
	pollResult: PollResponseResult | null;
	setPollResult: (result: PollResponseResult | null) => void;
};

const PollResultContext = createContext<PollResultContextType | undefined>(
	undefined
);

export const PollResultProvider = ({ children }: { children: ReactNode }) => {
	const [pollResult, setPollResult] = useState<PollResponseResult | null>(
		null
	);

	return (
		<PollResultContext.Provider value={{ pollResult, setPollResult }}>
			{children}
		</PollResultContext.Provider>
	);
};

export const usePollResult = () => {
	const context = useContext(PollResultContext);

	if (context === undefined) {
		throw new Error(
			"usePollResult must be used within a PollResultProvider"
		);
	}

	return context;
};
