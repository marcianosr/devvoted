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
