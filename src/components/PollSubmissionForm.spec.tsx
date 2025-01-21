import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PollSubmissionForm } from "./PollSubmissionForm";
import { submitPollResponse } from "@/services/polls";
import { useAuth } from "@/context/AuthContext";
import type { Poll } from "@/types/database";
import { mockUser, mockAuthContext } from "@/test/mocks";

// Mock the modules
vi.mock("@/services/polls", () => ({
	submitPollResponse: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
	useAuth: vi.fn(),
}));

// Test data
const mockPoll: Poll = {
	id: "poll1",
	pollNumber: 1,
	categories: ["React"],
	question: "What's your favorite React Hook?",
	options: [
		{ id: "1", text: "useState", isCorrect: true },
		{ id: "2", text: "useEffect", isCorrect: false },
		{ id: "3", text: "useContext", isCorrect: false },
	],
	status: "open",
	openingTime: new Date().toISOString(),
	closingTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
	responses: [],
};

describe(PollSubmissionForm, () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Authentication States", () => {
		it("shows sign-in message when user is not authenticated", () => {
			vi.mocked(useAuth).mockReturnValue({
				...mockAuthContext,
				user: null,
			});
			render(<PollSubmissionForm poll={mockPoll} />);

			expect(
				screen.getByText(/please sign in to participate/i)
			).toBeInTheDocument();
		});

		it("shows poll options when user is authenticated", () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			render(<PollSubmissionForm poll={mockPoll} />);

			mockPoll.options.forEach((option) => {
				expect(screen.getByText(option.text)).toBeInTheDocument();
			});
		});

		it("doesn't allow voting when user is not authenticated", () => {
			vi.mocked(useAuth).mockReturnValue({
				...mockAuthContext,
				user: null,
			});
			render(<PollSubmissionForm poll={mockPoll} />);

			expect(screen.getByText(/please sign in to participate/i));
		});
	});

	describe("Poll Status Handling", () => {
		it("shows closed message when poll is not open", () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			const closedPoll = { ...mockPoll, status: "closed" as const };
			render(<PollSubmissionForm poll={closedPoll} />);

			expect(
				screen.getByText(/no longer accepting responses/i)
			).toBeInTheDocument();
		});

		it("allows interaction when poll is open", () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			render(<PollSubmissionForm poll={mockPoll} />);

			const option = screen.getByText(mockPoll.options[0].text);
			expect(option).not.toHaveAttribute("disabled");
		});
	});

	describe("Option Selection", () => {
		it("highlights selected option", async () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			render(<PollSubmissionForm poll={mockPoll} />);

			const option = screen.getByText(mockPoll.options[0].text);
			await userEvent.click(option);

			expect(option.parentElement).toHaveClass("bg-blue-50");
		});

		it("enables submit button only when option is selected", async () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			render(<PollSubmissionForm poll={mockPoll} />);

			const submitButton = screen.getByText(/submit/i);
			expect(submitButton).toBeDisabled();

			const option = screen.getByText(mockPoll.options[0].text);
			await userEvent.click(option);

			expect(submitButton).not.toBeDisabled();
		});
	});

	describe("Form Submission", () => {
		it("submits selected option successfully", async () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			vi.mocked(submitPollResponse).mockResolvedValueOnce({
				success: true,
			});

			render(<PollSubmissionForm poll={mockPoll} />);

			// Select an option
			const option = screen.getByText(mockPoll.options[0].text);
			await userEvent.click(option);

			// Submit the form
			const submitButton = screen.getByText(/submit/i);
			await userEvent.click(submitButton);

			await waitFor(() => {
				expect(submitPollResponse).toHaveBeenCalledWith(
					mockPoll.id,
					mockUser.uid,
					[mockPoll.options[0].id]
				);
			});
		});

		it("shows error message on submission failure", async () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			const errorMessage = "Failed to submit response";
			vi.mocked(submitPollResponse).mockRejectedValueOnce(
				new Error(errorMessage)
			);

			render(<PollSubmissionForm poll={mockPoll} />);

			// Select and submit
			const option = screen.getByText(mockPoll.options[0].text);
			await userEvent.click(option);
			const submitButton = screen.getByText(/submit/i);
			await userEvent.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText(errorMessage)).toBeInTheDocument();
			});
		});

		it("disables submit button while submitting", async () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			vi.mocked(submitPollResponse).mockImplementationOnce(
				() => new Promise((resolve) => setTimeout(resolve, 100))
			);

			render(<PollSubmissionForm poll={mockPoll} />);

			// Select and submit
			const option = screen.getByText(mockPoll.options[0].text);
			await userEvent.click(option);
			const submitButton = screen.getByText(/submit/i);
			await userEvent.click(submitButton);

			expect(screen.getByText(/submitting/i)).toBeInTheDocument();
			expect(submitButton).toBeDisabled();
		});

		it("clears selection after successful submission", async () => {
			vi.mocked(useAuth).mockReturnValue(mockAuthContext);
			vi.mocked(submitPollResponse).mockResolvedValueOnce({
				success: true,
			});

			render(<PollSubmissionForm poll={mockPoll} />);

			// Select and submit
			const option = screen.getByText(mockPoll.options[0].text);
			await userEvent.click(option);
			const submitButton = screen.getByText(/submit/i);
			await userEvent.click(submitButton);

			await waitFor(() => {
				expect(option.parentElement).not.toHaveClass("bg-blue-50");
				expect(submitButton).toBeDisabled();
			});
		});
	});
});
