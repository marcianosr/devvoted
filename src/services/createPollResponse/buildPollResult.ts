export type BuildPollResult = {
	success: boolean;
	isCorrect: boolean;
	changes: {
		previousXP: number;
		newXP: number;
		xpGain: number;
		previousMultiplier: number;
		newMultiplier: number;
		previousStreak: number;
		newStreak: number;
		previousDevvotedScore: number;
		devvotedScore: number; // New score
		newBettingAverage: string;
		previousBettingAverage: string;
	};
};

export const buildPollResult = async ({
	status,
	previousStats,
	newStats,
}: {
	status: "correct" | "incorrect";
	previousStats: {
		xp: number;
		multiplier: number;
		streak: number;
		devvotedScore: number;
		bettingAverage: string;
	};
	newStats: {
		xp: number;
		multiplier: number;
		streak: number;
		devvotedScore: number;
		bettingAverage: string;
	};
}): Promise<BuildPollResult> => ({
	success: true,
	isCorrect: status === "correct",
	changes: {
		previousXP: previousStats.xp,
		newXP: newStats.xp,
		xpGain: newStats.xp - previousStats.xp,
		previousMultiplier: previousStats.multiplier,
		newMultiplier: newStats.multiplier,
		previousStreak: previousStats.streak,
		newStreak: newStats.streak,
		previousDevvotedScore: previousStats.devvotedScore,
		devvotedScore: newStats.devvotedScore,
		newBettingAverage: newStats.bettingAverage,
		previousBettingAverage: previousStats.bettingAverage,
	},
});
