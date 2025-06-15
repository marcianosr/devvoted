import { describe, it, expect, vi, Mock } from "vitest";
import { screen, render, act } from "@testing-library/react";
import RunProgressBar from "./RunProgressBar";
import {
	PollResultProvider,
	usePollResult,
} from "@/app/context/PollResultContext";
import { createMockPoll, createMockUser } from "@/test/factories";
import { ActiveRun } from "@/types/db";

vi.mock("@/app/context/PollResultContext", () => ({
	usePollResult: vi.fn(),
	PollResultProvider: ({ children }: { children: React.ReactNode }) =>
		children,
}));

vi.mock("@/services/userPerformance", () => ({
	useUserPerformance: vi.fn().mockReturnValue({
		data: { devvoted_score: 10.5 },
		isLoading: false,
	}),
}));

const createMockActiveRun = (overrides?: Partial<ActiveRun>): ActiveRun => ({
	id: 1,
	user_id: "test-user-1",
	category_code: "react",
	temporary_xp: 100,
	current_streak: 2,
	streak_multiplier: "0.5",
	started_at: new Date(),
	last_poll_at: new Date(),
	...overrides,
});

describe(RunProgressBar, () => {
	const mockPoll = createMockPoll({ category_code: "react" });
	const mockUser = createMockUser();
	const mockActiveRun = createMockActiveRun();

	(usePollResult as Mock).mockReturnValue({ pollResult: null });

	it("renders basic run information correctly", () => {
		render(
			<RunProgressBar
				activeRun={mockActiveRun}
				poll={mockPoll}
				user={mockUser}
			/>
		);

		expect(screen.getByText(/Category:/)).toHaveTextContent(
			`Category: ${mockPoll.category_code}`
		);

		expect(screen.getByText(/Status:/)).toHaveTextContent("Status: Open");

		expect(screen.getByText(/Available to bet:/)).toHaveTextContent(
			`Available to bet: ${mockActiveRun.temporary_xp} XP from ${mockActiveRun.category_code}`
		);

		expect(screen.getByText(/Streak Multiplier:/)).toHaveTextContent(
			`Streak Multiplier: ${mockActiveRun.streak_multiplier}×`
		);

		expect(screen.getByText(/Current streak:/)).toHaveTextContent(
			`Current streak: ${mockActiveRun.current_streak}`
		);
	});

	it.skip("shows an upgrade diff between before answering and after", async () => {
		const initialActiveRun = createMockActiveRun({
			temporary_xp: 100,
			current_streak: 2,
			streak_multiplier: "0.5",
		});

		const updatedActiveRun = createMockActiveRun({
			temporary_xp: 150,
			current_streak: 3,
			streak_multiplier: "0.7",
		});

		const { rerender } = render(
			<RunProgressBar
				activeRun={initialActiveRun}
				poll={mockPoll}
				user={mockUser}
			/>
		);

		expect(screen.getByText(/Current streak:/)).toHaveTextContent(
			`Current streak: ${initialActiveRun.current_streak}`
		);
		expect(screen.getByText(/Available to bet:/)).toHaveTextContent(
			`Available to bet: ${initialActiveRun.temporary_xp} XP from ${initialActiveRun.category_code}`
		);
		expect(screen.getByText(/Streak Multiplier:/)).toHaveTextContent(
			`Streak Multiplier: ${initialActiveRun.streak_multiplier}×`
		);

		(usePollResult as Mock).mockReturnValue({
			pollResult: {
				changes: {
					newStreak: 3,
					newXP: 150,
					newMultiplier: "0.7",
					xpGain: 50,
				},
			},
		});

		// Simulate a poll submission and rerender with new progress
		await act(async () => {
			rerender(
				<PollResultProvider>
					{" "}
					{/* Ensure context persists */}
					<RunProgressBar
						activeRun={updatedActiveRun}
						poll={mockPoll}
						user={mockUser}
					/>
				</PollResultProvider>
			);
		});

		// Assert the UI now shows the upgrade diff
		// expect(screen.getByText(/Current streak:/)).toHaveTextContent(
		// 	`🔥 Current streak: ${initialActiveRun.current_streak} → ${updatedActiveRun.current_streak}`
		// );

		// expect(screen.getByText(/Available to bet:/)).toHaveTextContent(
		// 	`💰 Available to bet: ${initialActiveRun.temporary_xp} XP from ${initialActiveRun.category_code} → ${updatedActiveRun.temporary_xp} XP`
		// );

		// expect(screen.getByText(/Streak Multiplier:/)).toHaveTextContent(
		// 	`Streak Multiplier: ${initialActiveRun.streak_multiplier}× → ${updatedActiveRun.streak_multiplier}×`
		// );
	});

	it("shows upgraded progress when a user submitted a poll", async () => {
		const updatedActiveRun = createMockActiveRun({
			temporary_xp: 150, // XP increased
			current_streak: 3, // Streak increased
			streak_multiplier: "0.7", // Multiplier increased
		});

		const { rerender } = render(
			<RunProgressBar
				activeRun={mockActiveRun}
				poll={mockPoll}
				user={mockUser}
			/>
		);

		await act(async () => {
			rerender(
				<PollResultProvider>
					<RunProgressBar
						activeRun={updatedActiveRun}
						poll={mockPoll}
						user={mockUser}
					/>
				</PollResultProvider>
			);
		});

		expect(screen.getByText(/Current streak:/)).toHaveTextContent(
			`Current streak: ${updatedActiveRun.current_streak}`
		);

		expect(screen.getByText(/Available to bet:/)).toHaveTextContent(
			`Available to bet: ${updatedActiveRun.temporary_xp} XP from ${updatedActiveRun.category_code}`
		);

		expect(screen.getByText(/Streak Multiplier:/)).toHaveTextContent(
			`Streak Multiplier: ${updatedActiveRun.streak_multiplier}×`
		);
	});
});
