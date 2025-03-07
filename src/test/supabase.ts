import { ActiveRun } from "@/types/db";
import { vi } from "vitest";

export type MockSupabaseResponse<T> = {
	data: T | null;
	error: string | null;
};

export type MockSupabaseQuery = {
	from: ReturnType<typeof vi.fn>;
	insert: ReturnType<typeof vi.fn>;
	select: ReturnType<typeof vi.fn>;
	eq: ReturnType<typeof vi.fn>;
	single: ReturnType<typeof vi.fn>;
	limit: ReturnType<typeof vi.fn>;
	update: ReturnType<typeof vi.fn>;
	maybeSingle: ReturnType<typeof vi.fn>;
	delete: ReturnType<typeof vi.fn>;
};

export const createMockSupabaseQuery = (): MockSupabaseQuery => ({
	from: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	select: vi.fn().mockReturnThis(),
	eq: vi.fn().mockReturnThis(),
	single: vi.fn(),
	limit: vi.fn().mockReturnThis(),
	update: vi.fn().mockReturnThis(),
	maybeSingle: vi.fn(),
	delete: vi.fn().mockReturnThis(),
});

export const createMockPollsOptionsTable = () => ({
	...createMockSupabaseQuery(),
	data: [
		{ id: 1, is_correct: true },
		{ id: 2, is_correct: true },
	],
	error: null,
});

export const createMockActiveRunsTable = (
	data: ActiveRun = {
		id: 1,
		user_id: "user123",
		category_code: "fun",
		last_poll_at: new Date(),
		current_streak: 1,
		locked_in_at: new Date(),
		started_at: new Date(),
		streak_multiplier: "1.0",
		temporary_xp: 10,
	}
) => ({
	...createMockSupabaseQuery(),
	maybeSingle: vi.fn().mockResolvedValue({
		data,
		error: null,
	}),
});

export const createMockSupabaseClient = (): MockSupabaseQuery => {
	const mockSupabase = createMockSupabaseQuery();

	mockSupabase.from.mockImplementation((table: string) => {
		switch (table) {
			case "polls_options":
				return createMockPollsOptionsTable();
			case "polls_active_runs":
				return createMockActiveRunsTable();
			default:
				return mockSupabase;
		}
	});

	return mockSupabase;
};
