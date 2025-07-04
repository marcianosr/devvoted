import { describe, it, expect } from "vitest";
import {
	buildPollResult,
	type BuildPollResult,
} from "@/domain/poll-result/buildPollResult";

describe("buildPollResult", () => {
	it("builds a correct poll result with proper changes", async () => {
		const status = "correct";
		const previousStats = {
			xp: 100,
			multiplier: 1.5,
			streak: 3,
			bettingAverage: "40",
		};
		const newStats = {
			xp: 150,
			multiplier: 2.0,
			streak: 4,
			bettingAverage: "45",
		};

		const result = await buildPollResult({
			status,
			previousStats,
			newStats,
		});

		expect(result).toEqual<BuildPollResult>({
			success: true,
			isCorrect: true,
			isPartiallyCorrect: false,

			changes: {
				previousXP: previousStats.xp,
				newXP: newStats.xp,
				xpGain: newStats.xp - previousStats.xp, // 50
				previousMultiplier: previousStats.multiplier,
				newMultiplier: newStats.multiplier,
				previousStreak: previousStats.streak,
				newStreak: newStats.streak,
				newBettingAverage: newStats.bettingAverage,
				previousBettingAverage: previousStats.bettingAverage,
			},
		});
	});

	it("builds an incorrect poll result with proper changes", async () => {
		const status = "incorrect";
		const previousStats = {
			xp: 100,
			multiplier: 1.5,
			streak: 3,
			bettingAverage: "40",
		};
		const newStats = {
			xp: 0, // Reset to 0 for incorrect answers
			multiplier: 0.1, // Reset to minimum
			streak: 0, // Reset streak
			bettingAverage: "38", // Slight decrease
		};

		const result = await buildPollResult({
			status,
			previousStats,
			newStats,
		});

		expect(result).toEqual<BuildPollResult>({
			success: true,
			isCorrect: false,
			isPartiallyCorrect: false,
			changes: {
				previousXP: previousStats.xp,
				newXP: newStats.xp,
				xpGain: newStats.xp - previousStats.xp, // -100
				previousMultiplier: previousStats.multiplier,
				newMultiplier: newStats.multiplier,
				previousStreak: previousStats.streak,
				newStreak: newStats.streak,
				newBettingAverage: newStats.bettingAverage,
				previousBettingAverage: previousStats.bettingAverage,
			},
		});
	});

	it("builds a correct poll result with proper changes", async () => {
		const status = "correct";
		const previousStats = {
			xp: 250,
			multiplier: 2.0,
			streak: 5,
			bettingAverage: "60",
		};
		const newStats = {
			xp: 400, // Large XP gain
			multiplier: 2.8,
			streak: 6,
			bettingAverage: "65",
		};

		const result = await buildPollResult({
			status,
			previousStats,
			newStats,
		});

		expect(result.changes.xpGain).toBe(150); // 400 - 250
		expect(result.changes.xpGain).toBe(newStats.xp - previousStats.xp);
	});
});
