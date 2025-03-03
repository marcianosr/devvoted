// src/services/__tests__/createPollResponse.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPostPollResponse } from "./createPollResponse";
import { createClient } from "@/app/supabase/server";
import { createMockPoll } from "@/test/factories";
import { createMockSupabaseClient } from "@/test/supabase";

vi.mock("@/app/supabase/server");

describe("createPostPollResponse", () => {
	let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockSupabase = createMockSupabaseClient();
		vi.mocked(createClient).mockReturnValue(mockSupabase);
	});

	it("handles answer submission with correct data", async () => {
		const mockPoll = createMockPoll();

		// Mock response for creating poll response
		mockSupabase.single.mockResolvedValueOnce({
			data: { response_id: 1 },
			error: null,
		});

		const result = await createPostPollResponse({
			poll: mockPoll,
			userId: "user123",
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
				userId: "user123",
				selectedOptions: ["1", "2"],
				selectedBet: 100,
			})
		).rejects.toThrow("Failed to create poll response");
	});
});
