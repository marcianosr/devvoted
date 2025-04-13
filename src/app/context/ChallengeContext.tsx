"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Challenge } from "@/types/db";

type ChallengeContextType = {
	activeChallenge: Challenge | null;
	setActiveChallenge: (challenge: Challenge | null) => void;
	isFinalBoss: boolean;
};

const ChallengeContext = createContext<ChallengeContextType | undefined>(
	undefined
);

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
	const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
		null
	);

	console.log("Active Challenge:", activeChallenge);

	// Determine if the current poll is a Final Boss
	const isFinalBoss = activeChallenge !== null;

	return (
		<ChallengeContext.Provider
			value={{
				activeChallenge,
				setActiveChallenge,
				isFinalBoss,
			}}
		>
			{children}
		</ChallengeContext.Provider>
	);
};

export const useChallenge = () => {
	const context = useContext(ChallengeContext);
	if (context === undefined) {
		throw new Error("useChallenge must be used within a ChallengeProvider");
	}
	return context;
};
