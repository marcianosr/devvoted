import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { handleWrongPollResponse } from "./handleWrongPollResponse";
import {
	resetActiveRunByCategoryCode,
	resetActiveRunByAllCategories,
} from "@/domain/run/resetRun";
import { SupabaseClient } from "@supabase/supabase-js";

// Mock the resetRun functions
vi.mock("@/domain/run/resetRun", () => ({
	resetActiveRunByCategoryCode: vi.fn(),
	resetActiveRunByAllCategories: vi.fn(),
}));

describe.only("handleWrongPollResponse", () => {
	const userId = "123e4567-e89b-12d3-a456-426614174000";
	const categoryCode = "test-category";
	const selectedBet = 50;
	const mockSupabase = {} as unknown as SupabaseClient;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("resets only the category when newXP is greater than 0", async () => {
		(resetActiveRunByCategoryCode as Mock).mockResolvedValue({
			newXP: 10,
			success: true,
		});

		const result = await handleWrongPollResponse({
			supabase: mockSupabase,
			userId,
			categoryCode,
			selectedBet,
		});

		expect(resetActiveRunByCategoryCode).toHaveBeenCalledWith({
			supabase: mockSupabase,
			userId,
			categoryCode,
			selectedBet,
		});

		expect(resetActiveRunByAllCategories).not.toHaveBeenCalled();

		// Verify the returned newXP
		expect(result).toEqual({ newXP: 10 });
	});

	it("resets all categories when newXP hits 0", async () => {
		(resetActiveRunByCategoryCode as Mock).mockResolvedValue({
			newXP: 0,
			success: true,
		});
		(resetActiveRunByAllCategories as Mock).mockResolvedValue({
			success: true,
		});

		const result = await handleWrongPollResponse({
			supabase: mockSupabase,
			userId,
			categoryCode,
			selectedBet,
		});

		expect(resetActiveRunByCategoryCode).toHaveBeenCalledWith({
			supabase: mockSupabase,
			userId,
			categoryCode,
			selectedBet,
		});

		expect(resetActiveRunByAllCategories).toHaveBeenCalledWith({
			supabase: mockSupabase,
			userId,
		});

		expect(result).toEqual({ newXP: 0 });
	});

	it("handles errors from resetActiveRunByCategoryCode", async () => {
		(resetActiveRunByCategoryCode as Mock).mockRejectedValue(
			new Error("Database error")
		);

		// Verify the error is propagated
		await expect(
			handleWrongPollResponse({
				supabase: mockSupabase,
				userId,
				categoryCode,
				selectedBet,
			})
		).rejects.toThrow("Database error");

		// Verify resetActiveRunByAllCategories was NOT called
		expect(resetActiveRunByAllCategories).not.toHaveBeenCalled();
	});

	it("handles errors from resetActiveRunByAllCategories", async () => {
		(resetActiveRunByCategoryCode as Mock).mockResolvedValue({
			newXP: 0,
			success: true,
		});

		// Mock resetActiveRunByAllCategories to throw an error
		(resetActiveRunByAllCategories as Mock).mockRejectedValue(
			new Error("Reset all categories error")
		);

		// Verify the error is propagated
		await expect(
			handleWrongPollResponse({
				supabase: mockSupabase,
				userId,
				categoryCode,
				selectedBet,
			})
		).rejects.toThrow("Reset all categories error");
	});

	it("uses default bet of 100% when not provided", async () => {
		(resetActiveRunByCategoryCode as Mock).mockResolvedValue({
			newXP: 5,
			success: true,
		});

		await handleWrongPollResponse({
			supabase: mockSupabase,
			userId,
			categoryCode,
		});

		expect(resetActiveRunByCategoryCode).toHaveBeenCalledWith({
			supabase: mockSupabase,
			userId,
			categoryCode,
			selectedBet: 100, // Default value
		});
	});
});
