import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	createPostPollResponse,
	resetActiveRunByAllCategories,
	resetActiveRunByCategoryCode,
} from "../createPollResponse";
import { createClient } from "@/app/supabase/server";
import { createMockPoll } from "@/test/factories";
import { createMockSupabaseClient } from "@/test/supabase";

vi.mock("@/app/supabase/server");

describe(createPostPollResponse, () => {
	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockSupabase = createMockSupabaseClient();
		vi.mocked(createClient).mockReturnValue(mockSupabase);
	});

	it("handles answer submission with correct data", async () => {
		const mockPoll = createMockPoll();

		mockSupabase.single.mockResolvedValueOnce({
			data: { response_id: 1 },
			error: null,
		});

		const result = await createPostPollResponse({
			poll: mockPoll,
			userId: "123e4567-e89b-12d3-a456-426614174000",
			selectedOptions: ["1", "2"],
			selectedBet: 100,
		});

		expect(result.success).toBe(true);
		expect(mockSupabase.from).toHaveBeenCalledWith("polls_responses");
		expect(mockSupabase.from).toHaveBeenCalledWith("polls_options");
		expect(mockSupabase.from).toHaveBeenCalledWith("polls_active_runs");
	});

	it("handles answer submission with wrong data", async () => {
		const mockPoll = createMockPoll();

		// Mock response for creating poll response with an error
		mockSupabase.single.mockResolvedValueOnce({
			data: null,
			error: "Something went wrong",
		});

		// Use expect().rejects to test that the promise rejects with the expected error
		await expect(
			createPostPollResponse({
				poll: mockPoll,
				userId: "123e4567-e89b-12d3-a456-426614174000",
				selectedOptions: ["1", "2"],
				selectedBet: 100,
			})
		).rejects.toThrow("Failed to create poll response");
	});
});

describe(resetActiveRunByCategoryCode, () => {
	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockSupabase = createMockSupabaseClient();
		vi.mocked(createClient).mockReturnValue(mockSupabase);
	});

	it("resets the active run for a specific category", async () => {
		// Mock the Supabase update chain
		mockSupabase.from.mockReturnValue({
			update: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					eq: vi.fn().mockResolvedValue({ error: null }),
				}),
			}),
		});

		const result = await resetActiveRunByCategoryCode({
			userId: "123e4567-e89b-12d3-a456-426614174000",
			categoryCode: "React",
		});

		expect(result.success).toBe(true);

		expect(mockSupabase.from).toHaveBeenCalledWith("polls_active_runs");

		expect(mockSupabase.from().update).toHaveBeenCalledWith(
			expect.objectContaining({
				last_poll_at: expect.any(Date),
			})
		);

		expect(mockSupabase.from().update().eq).toHaveBeenCalledWith(
			"category_code",
			"React"
		);
		expect(mockSupabase.from().update().eq().eq).toHaveBeenCalledWith(
			"user_id",
			"123e4567-e89b-12d3-a456-426614174000"
		);
	});
});

describe(resetActiveRunByAllCategories, () => {
	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockSupabase = createMockSupabaseClient();
		vi.mocked(createClient).mockReturnValue(mockSupabase);
	});

	it("resets the active run for all categories", async () => {
		mockSupabase.from.mockReturnValue({
			update: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					eq: vi.fn().mockResolvedValue({ error: null }),
				}),
			}),
			delete: vi.fn().mockReturnValue({
				eq: vi.fn().mockResolvedValue({ error: null }),
			}),
		});

		const result = await resetActiveRunByAllCategories({
			userId: "123e4567-e89b-12d3-a456-426614174000",
		});

		expect(result.success).toBe(true);

		expect(mockSupabase.from).toHaveBeenCalledWith("polls_active_runs");
		expect(mockSupabase.from().delete).toHaveBeenCalled();
		expect(mockSupabase.from().delete().eq).toHaveBeenCalledWith(
			"user_id",
			"123e4567-e89b-12d3-a456-426614174000"
		);

		expect(mockSupabase.from).toHaveBeenCalledWith("users");
		expect(mockSupabase.from().update).toHaveBeenCalledWith({
			active_config: null,
		});
		expect(mockSupabase.from().update().eq).toHaveBeenCalledWith(
			"id",
			"123e4567-e89b-12d3-a456-426614174000"
		);
	});
});
