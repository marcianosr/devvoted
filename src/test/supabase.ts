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
	data = {
		id: 1,
		user_id: "user123",
		category_code: "fun",
		streak: 1,
		xp: 100,
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
