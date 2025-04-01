import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPollResponse } from "@/services/createPollResponse/createPollResponse";
import { createClient } from "@/app/supabase/server";
import { createMockSupabaseClient } from "@/test/supabase";

import { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/app/supabase/server");

describe("createPollResponse", () => {
	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockSupabase = createMockSupabaseClient();
		vi.mocked(createClient).mockResolvedValue(
			mockSupabase as unknown as SupabaseClient
		);
	});

	it("successfully creates a poll response and returns the response ID", async () => {
		const pollId = 123;
		const userId = "user-123";
		const expectedResponseId = 456;

		mockSupabase.from = vi.fn().mockReturnThis();
		mockSupabase.insert = vi.fn().mockReturnThis();
		mockSupabase.select = vi.fn().mockReturnThis();
		mockSupabase.single = vi.fn().mockResolvedValue({
			data: { response_id: expectedResponseId },
			error: null,
		});

		const result = await createPollResponse(
			mockSupabase as unknown as SupabaseClient,
			pollId,
			userId
		);

		expect(mockSupabase.from).toHaveBeenCalledWith("polls_responses");
		expect(mockSupabase.insert).toHaveBeenCalledWith({
			poll_id: pollId,
			user_id: userId,
		});
		expect(mockSupabase.select).toHaveBeenCalledWith("response_id");
		expect(mockSupabase.single).toHaveBeenCalled();
		expect(result).toEqual({ response_id: expectedResponseId });
	});
});

// describe.skip(resetActiveRunByCategoryCode, () => {
// 	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 		mockSupabase = createMockSupabaseClient();
// 		vi.mocked(createClient).mockReturnValue(mockSupabase);
// 	});

// 	it("resets the active run for a specific category", async () => {
// 		// Mock the Supabase update chain
// 		mockSupabase.from.mockReturnValue({
// 			update: vi.fn().mockReturnValue({
// 				eq: vi.fn().mockReturnValue({
// 					eq: vi.fn().mockResolvedValue({ error: null }),
// 				}),
// 			}),
// 		});

// 		const result = await resetActiveRunByCategoryCode({
// 			userId: "123e4567-e89b-12d3-a456-426614174000",
// 			categoryCode: "React",
// 		});

// 		expect(result.success).toBe(true);

// 		expect(mockSupabase.from).toHaveBeenCalledWith("polls_active_runs");

// 		expect(mockSupabase.from().update).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				last_poll_at: expect.any(Date),
// 			})
// 		);

// 		expect(mockSupabase.from().update().eq).toHaveBeenCalledWith(
// 			"category_code",
// 			"React"
// 		);
// 		expect(mockSupabase.from().update().eq().eq).toHaveBeenCalledWith(
// 			"user_id",
// 			"123e4567-e89b-12d3-a456-426614174000"
// 		);
// 	});
// });

// describe.skip(resetActiveRunByAllCategories, () => {
// 	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 		mockSupabase = createMockSupabaseClient();
// 		vi.mocked(createClient).mockReturnValue(mockSupabase);
// 	});

// 	it("resets the active run for all categories", async () => {
// 		mockSupabase.from.mockReturnValue({
// 			update: vi.fn().mockReturnValue({
// 				eq: vi.fn().mockReturnValue({
// 					eq: vi.fn().mockResolvedValue({ error: null }),
// 				}),
// 			}),
// 			delete: vi.fn().mockReturnValue({
// 				eq: vi.fn().mockResolvedValue({ error: null }),
// 			}),
// 		});

// 		const result = await resetActiveRunByAllCategories({
// 			userId: "123e4567-e89b-12d3-a456-426614174000",
// 		});

// 		expect(result.success).toBe(true);

// 		expect(mockSupabase.from).toHaveBeenCalledWith("polls_active_runs");
// 		expect(mockSupabase.from().delete).toHaveBeenCalled();
// 		expect(mockSupabase.from().delete().eq).toHaveBeenCalledWith(
// 			"user_id",
// 			"123e4567-e89b-12d3-a456-426614174000"
// 		);

// 		expect(mockSupabase.from).toHaveBeenCalledWith("users");
// 		expect(mockSupabase.from().update).toHaveBeenCalledWith({
// 			active_config: null,
// 		});
// 		expect(mockSupabase.from().update().eq).toHaveBeenCalledWith(
// 			"id",
// 			"123e4567-e89b-12d3-a456-426614174000"
// 		);
// 	});
// });
