import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { PollResultProvider, usePollResult } from "./PollResultContext";

const TestComponent = ({ testId = "test-component" }: { testId?: string }) => {
	const { pollResult, setPollResult } = usePollResult();

	return (
		<div>
			<div data-testid={testId}>
				{pollResult ? JSON.stringify(pollResult) : "No result"}
			</div>
			<button
				onClick={() =>
					setPollResult({
						success: true,
						isCorrect: true,
						changes: {
							previousXP: 100,
							newXP: 150,
							xpGain: 50,
							previousMultiplier: 1,
							newMultiplier: 1.5,
							previousStreak: 2,
							newStreak: 3,
						},
					})
				}
			>
				Set Result
			</button>
			<button onClick={() => setPollResult(null)}>Clear Result</button>
		</div>
	);
};

describe(PollResultProvider, () => {
	it("provides initial null value for pollResult", () => {
		render(
			<PollResultProvider>
				<TestComponent />
			</PollResultProvider>
		);

		expect(screen.getByTestId("test-component")).toHaveTextContent(
			"No result"
		);
	});

	it("sets the poll result", () => {
		render(
			<PollResultProvider>
				<TestComponent />
			</PollResultProvider>
		);

		expect(screen.getByTestId("test-component")).toHaveTextContent(
			"No result"
		);

		act(() => {
			screen.getByText("Set Result").click();
		});

		const content = screen.getByTestId("test-component").textContent;
		expect(content).toContain("success");
		expect(content).toContain("isCorrect");
		expect(content).toContain("150"); // newXP
		expect(content).toContain("3"); // newStreak
	});
});
