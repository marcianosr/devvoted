import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { handleCorrectPollResponse } from "./handleCorrectPollResponse";

import {
	getRunDataByCategoryCode,
	updateActiveRunByCategoryCode,
} from "../run/runDataByCategory";
import { calculateBetXP } from "../score-calculation/calculateXP";

vi.mock("./runDataByCategory", () => ({
	getRunDataByCategoryCode: vi.fn(),
	updateActiveRunByCategoryCode: vi.fn(),
}));

// Refactor later with createMockSupabaseQuery
vi.mock("@/database/db", () => ({
	db: {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		execute: vi.fn().mockResolvedValue([]),
	},
}));

vi.mock("@/services/calculateXP", () => ({
	calculateBetXP: vi.fn().mockReturnValue({
		betXP: 50,
		totalXP: 50,
	}),
}));

vi.mock("@/services/multipliers", () => ({
	DEFAULT_MULTIPLIER: 0.1,
	MIN_STREAK_MULTIPLIER: 0.1,
	MAX_STREAK_MULTIPLIER: 5.0,
	getStreakMultiplierIncreaseForBet: vi.fn().mockReturnValue(0.2),
}));

describe("handleCorrectPollResponse", () => {
	const userId = "123e4567-e89b-12d3-a456-426614174000";
	const categoryCode = "test-category";
	const selectedBet = 25;
	const mockDate = new Date("2025-05-13T12:00:00Z");

	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		vi.setSystemTime(mockDate);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("updates active run with correct values when user has no previous data", async () => {
		(getRunDataByCategoryCode as Mock).mockResolvedValue(null);
		(updateActiveRunByCategoryCode as Mock).mockResolvedValue(undefined);

		await handleCorrectPollResponse({
			selectedBet,
			userId,
			categoryCode,
		});

		expect(updateActiveRunByCategoryCode).toHaveBeenCalledWith(
			{
				user_id: userId,
				temporary_xp: 50, // Default 0 + 50 from calculateBetXP
				streak_multiplier: "0.3", // DEFAULT_MULTIPLIER (0.1) + increase (0.2)
				last_poll_at: mockDate,
				current_streak: 1, // First correct answer
			},
			categoryCode
		);
	});

	it("updates active run with correct values when user has previous data", async () => {
		const mockPreviousData = {
			temporary_xp: 100,
			streak_multiplier: "0.5",
			current_streak: 2,
		};

		(getRunDataByCategoryCode as Mock).mockResolvedValue(mockPreviousData);
		(updateActiveRunByCategoryCode as Mock).mockResolvedValue(undefined);

		await handleCorrectPollResponse({
			selectedBet,
			userId,
			categoryCode,
		});

		expect(updateActiveRunByCategoryCode).toHaveBeenCalledWith(
			{
				user_id: userId,
				temporary_xp: 150, // Previous 100 + 50 from calculateBetXP
				streak_multiplier: "0.7", // Previous 0.5 + increase (0.2)
				last_poll_at: mockDate,
				current_streak: 3, // Previous 2 + 1
			},
			categoryCode
		);
	});

	it("uses pre-calculated XP when provided", async () => {
		const mockPreviousData = {
			temporary_xp: 100,
			streak_multiplier: "0.5",
			current_streak: 2,
		};

		(getRunDataByCategoryCode as Mock).mockResolvedValue(mockPreviousData);
		(updateActiveRunByCategoryCode as Mock).mockResolvedValue(undefined);

		const calculatedXP = 75;
		await handleCorrectPollResponse({
			selectedBet,
			userId,
			categoryCode,
			calculatedXP,
		});

		expect(updateActiveRunByCategoryCode).toHaveBeenCalledWith(
			{
				user_id: userId,
				temporary_xp: 175, // Previous 100 + pre-calculated 75
				streak_multiplier: "0.7", // Previous 0.5 + increase (0.2)
				last_poll_at: mockDate,
				current_streak: 3, // Previous 2 + 1
			},
			categoryCode
		);

		expect(calculateBetXP).not.toHaveBeenCalled();
	});

	it("respects MAX_STREAK_MULTIPLIER limit", async () => {
		const mockPreviousData = {
			temporary_xp: 100,
			streak_multiplier: "4.9", // Close to MAX_STREAK_MULTIPLIER (5.0)
			current_streak: 10,
		};

		(getRunDataByCategoryCode as Mock).mockResolvedValue(mockPreviousData);
		(updateActiveRunByCategoryCode as Mock).mockResolvedValue(undefined);

		await handleCorrectPollResponse({
			selectedBet,
			userId,
			categoryCode,
		});

		expect(updateActiveRunByCategoryCode).toHaveBeenCalledWith(
			expect.objectContaining({
				streak_multiplier: "5.0",
			}),
			categoryCode
		);
	});

	it("handles database errors gracefully", async () => {
		(getRunDataByCategoryCode as Mock).mockRejectedValue(
			new Error("Database error")
		);

		await expect(
			handleCorrectPollResponse({
				selectedBet,
				userId,
				categoryCode,
			})
		).rejects.toThrow("Database error");
	});
});
