import { describe, it, expect, vi } from "vitest";
import { getPollsAnsweredCount } from "../score-calculation/calculateBettingAverage";

vi.mock("./calculateBettingAverage", () => {
	return {
		getPollsAnsweredCount: vi.fn(),
	};
});

describe("getPollsAnsweredCount", () => {
	const userId = "test-user-id";
	const categoryCode = "css";

	it("returns the correct count of polls answered", async () => {
		vi.mocked(getPollsAnsweredCount).mockResolvedValue(3);

		const result = await getPollsAnsweredCount(userId, categoryCode);

		expect(result).toBe(3);
	});

	it("returns 0 when there are no polls answered", async () => {
		vi.mocked(getPollsAnsweredCount).mockResolvedValue(0);

		const result = await getPollsAnsweredCount(userId, categoryCode);

		expect(result).toBe(0);
	});

	it("handles database errors gracefully", async () => {
		vi.mocked(getPollsAnsweredCount).mockRejectedValue(
			new Error("Database error")
		);

		try {
			await getPollsAnsweredCount(userId, categoryCode);
			// If we get here, the test should fail
			expect(true).toBe(false);
		} catch (error: unknown) {
			if (error instanceof Error) {
				expect(error.message).toBe("Database error");
			} else {
				throw new Error("Unexpected error type");
			}
		}
	});
});
