import { describe, it, expect, vi, beforeEach } from "vitest";
import { evaluatePollResponse } from "./evaluatePollResponse";
import {
	createPollResponse,
	createPollResponseOptions,
} from "./createPollResponse";
import { getPollOptions } from "./getPollOptions";
import { Poll, PollOption } from "@/types/db";
import { SupabaseClient } from "@supabase/supabase-js";

// Mock the dependencies
vi.mock("./createPollResponse", () => ({
	createPollResponse: vi.fn(),
	createPollResponseOptions: vi.fn(),
}));

vi.mock("./getPollOptions", () => ({
	getPollOptions: vi.fn(),
}));

describe("evaluatePollResponse", () => {
	const mockSupabase = {} as SupabaseClient;
	const mockUserId = "test-user-id";
	const mockResponseId = 123;

	// Sample poll options that will be returned by the mocked getPollOptions
	const mockPollOptions: PollOption[] = [
		{ id: 1, poll_id: 1, option: "Option 1", is_correct: true },
		{ id: 2, poll_id: 1, option: "Option 2", is_correct: true },
		{ id: 3, poll_id: 1, option: "Option 3", is_correct: false },
		{ id: 4, poll_id: 1, option: "Option 4", is_correct: false },
	];

	beforeEach(() => {
		vi.clearAllMocks();

		(
			createPollResponse as unknown as ReturnType<typeof vi.fn>
		).mockResolvedValue({ response_id: mockResponseId });
		(
			createPollResponseOptions as unknown as ReturnType<typeof vi.fn>
		).mockResolvedValue(undefined);
		(
			getPollOptions as unknown as ReturnType<typeof vi.fn>
		).mockResolvedValue(mockPollOptions);
	});

	describe("Single choice polls", () => {
		const mockSingleChoicePoll: Poll = {
			id: 1,
			question: "Test Question",
			status: "open",
			answer_type: "single",
			category_code: "test",
			opening_time: new Date(),
			closing_time: new Date(),
		} as Poll;

		it("returns the correct result when the correct option is selected", async () => {
			const selectedOptions = ["1"]; // The first option is correct

			const result = await evaluatePollResponse({
				supabase: mockSupabase,
				poll: mockSingleChoicePoll,
				userId: mockUserId,
				selectedOptions,
			});

			expect(result).toEqual({
				hasIncorrectOption: false,
				hasAllCorrectOptionsSelected: false, // Only selected one of the two correct options
				isSingleChoice: true,
				correctnessScore: 1, // For single choice, it's 1 if the selected option is correct
				correctOptionsCount: 2,
				totalCorrectOptionsCount: 2,
				selectedCorrectOptionsCount: 1,
				pollOptions: mockPollOptions,
			});
		});

		it("returns the incorrect result when a wrong option is selected", async () => {
			const selectedOptions = ["3"]; // The third option is incorrect

			const result = await evaluatePollResponse({
				supabase: mockSupabase,
				poll: mockSingleChoicePoll,
				userId: mockUserId,
				selectedOptions,
			});

			expect(result).toEqual({
				hasIncorrectOption: true,
				hasAllCorrectOptionsSelected: false,
				isSingleChoice: true,
				correctnessScore: 0, // For single choice, it's 0 if the selected option is incorrect
				correctOptionsCount: 2,
				totalCorrectOptionsCount: 2,
				selectedCorrectOptionsCount: 0,
				pollOptions: mockPollOptions,
			});
		});
	});

	describe("multiple choice polls", () => {
		const mockMultipleChoicePoll: Poll = {
			id: 1,
			question: "Test Question",
			status: "open",
			answer_type: "multiple",
			category_code: "test",
			opening_time: new Date(),
			closing_time: new Date(),
		} as Poll;

		it("returns the correct result when all correct options are selected", async () => {
			const selectedOptions = ["1", "2"]; // Both correct options

			const result = await evaluatePollResponse({
				supabase: mockSupabase,
				poll: mockMultipleChoicePoll,
				userId: mockUserId,
				selectedOptions,
			});

			expect(result).toEqual({
				hasIncorrectOption: false,
				hasAllCorrectOptionsSelected: true,
				isSingleChoice: false,
				correctnessScore: 1, // Selected all correct options
				correctOptionsCount: 2,
				totalCorrectOptionsCount: 2,
				selectedCorrectOptionsCount: 2,
				pollOptions: mockPollOptions,
			});
		});

		it("returns the correct result when some correct options are selected", async () => {
			const selectedOptions = ["1"]; // Only one of the two correct options

			const result = await evaluatePollResponse({
				supabase: mockSupabase,
				poll: mockMultipleChoicePoll,
				userId: mockUserId,
				selectedOptions,
			});

			expect(result).toEqual({
				hasIncorrectOption: false,
				hasAllCorrectOptionsSelected: false,
				isSingleChoice: false,
				correctnessScore: 0.5, // Selected 1 of 2 correct options
				correctOptionsCount: 2,
				totalCorrectOptionsCount: 2,
				selectedCorrectOptionsCount: 1,
				pollOptions: mockPollOptions,
			});
		});

		it("returns the correct result when correct and incorrect options are selected", async () => {
			const selectedOptions = ["1", "3"]; // One correct and one incorrect

			const result = await evaluatePollResponse({
				supabase: mockSupabase,
				poll: mockMultipleChoicePoll,
				userId: mockUserId,
				selectedOptions,
			});

			// Expect a partial score with penalty
			// Base score: 1/2 = 0.5 (selected 1 of 2 correct options)
			// Penalty: 1/4 = 0.25 (1 incorrect selection out of 4 total options)
			// Final score: 0.5 - 0.25 = 0.25
			expect(result.hasIncorrectOption).toBe(true);
			expect(result.hasAllCorrectOptionsSelected).toBe(false);
			expect(result.isSingleChoice).toBe(false);
			expect(result.correctnessScore).toBe(0.25);
			expect(result.selectedCorrectOptionsCount).toBe(1);
			expect(result.totalCorrectOptionsCount).toBe(2);
		});

		it("returns the correct result when only incorrect options are selected", async () => {
			const selectedOptions = ["3", "4"]; // Both incorrect options

			const result = await evaluatePollResponse({
				supabase: mockSupabase,
				poll: mockMultipleChoicePoll,
				userId: mockUserId,
				selectedOptions,
			});

			expect(result).toEqual({
				hasIncorrectOption: true,
				hasAllCorrectOptionsSelected: false,
				isSingleChoice: false,
				correctnessScore: 0, // Selected no correct options, only incorrect ones
				correctOptionsCount: 2,
				totalCorrectOptionsCount: 2,
				selectedCorrectOptionsCount: 0,
				pollOptions: mockPollOptions,
			});
		});
	});
});
