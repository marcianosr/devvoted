import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import PollSubmission from "./index";
import * as pollsApi from "@/services/api/createPostPollResponse";
import {
	createMockPoll,
	createMockUser,
	createMockPollOptions,
} from "@/test/factories";
import { renderWithProviders } from "@/test/utils";

vi.mock("@/services/api/polls", () => ({
	createPostPollResponse: vi.fn(),
}));

describe(PollSubmission, () => {
	const mockPoll = createMockPoll();
	const mockUser = createMockUser();
	const mockOptions = createMockPollOptions(3);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders poll options and allows selection", () => {
		renderWithProviders(
			<PollSubmission
				poll={mockPoll}
				options={mockOptions}
				user={mockUser}
				userSelectedOptions={[]}
			/>
		);

		// Check if all options are rendered
		mockOptions.forEach((option) => {
			expect(screen.getByText(option.option)).toBeInTheDocument();
		});

		// Select an option
		const option = screen.getByText(mockOptions[0].option);
		fireEvent.click(option);
		expect(option.parentElement).toHaveClass("border-purple-600");
	});

	it("shows success message immediately after successful submission", async () => {
		vi.mocked(pollsApi.createPostPollResponse).mockResolvedValueOnce();

		renderWithProviders(
			<PollSubmission
				poll={mockPoll}
				options={mockOptions}
				user={mockUser}
				userSelectedOptions={[]}
			/>
		);

		// Select and submit an option
		const option = screen.getByText(mockOptions[0].option);
		fireEvent.click(option);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(submitButton);

		// Check if success message appears immediately
		await waitFor(() => {
			expect(
				screen.getByText("Your response has been recorded:")
			).toBeInTheDocument();
		});

		// Verify API was called with correct parameters
		expect(pollsApi.createPostPollResponse).toHaveBeenCalledWith({
			pollId: mockPoll.id.toString(),
			userId: mockUser.id,
			selectedOptions: ["1"], // ID of TypeScript option
		});
	});

	it("shows error message when submission fails", async () => {
		const errorMessage = "Failed to submit response";
		vi.mocked(pollsApi.createPostPollResponse).mockRejectedValueOnce(
			new Error(errorMessage)
		);

		renderWithProviders(
			<PollSubmission
				poll={mockPoll}
				options={mockOptions}
				user={mockUser}
				userSelectedOptions={[]}
			/>
		);

		// Select and submit an option
		const option = screen.getByText(mockOptions[0].option);
		fireEvent.click(option);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(submitButton);

		// Check if error message appears
		await waitFor(() => {
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});

	it("disables interaction when user has already responded", () => {
		renderWithProviders(
			<PollSubmission
				poll={mockPoll}
				options={mockOptions}
				user={mockUser}
				userSelectedOptions={["1"]} // First option
			/>
		);

		// Verify success message is shown
		expect(
			screen.getByText("Your response has been recorded:")
		).toBeInTheDocument();

		// Try to select another option
		const option = screen.getByText(mockOptions[1].option);
		fireEvent.click(option);

		// Verify the new option wasn't selected
		expect(option.parentElement).not.toHaveClass("border-purple-600");

		// Verify submit button is not present
		expect(
			screen.queryByRole("button", { name: /submit/i })
		).not.toBeInTheDocument();
	});

	it("shows closed message for closed polls", () => {
		const closedPoll = createMockPoll({ status: "closed" as const });

		renderWithProviders(
			<PollSubmission
				poll={closedPoll}
				options={mockOptions}
				user={mockUser}
				userSelectedOptions={[]}
			/>
		);

		expect(
			screen.getByText(/This poll is now closed./i)
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /submit/i })
		).not.toBeInTheDocument();
	});

	it("handles multiple option selections", () => {
		renderWithProviders(
			<PollSubmission
				poll={mockPoll}
				options={mockOptions}
				user={mockUser}
				userSelectedOptions={[]}
			/>
		);

		// Select multiple options
		const firstOption = screen.getByText(mockOptions[0].option);
		const secondOption = screen.getByText(mockOptions[1].option);

		fireEvent.click(firstOption);
		fireEvent.click(secondOption);

		// Verify both options are selected
		expect(firstOption.parentElement).toHaveClass("border-purple-600");
		expect(secondOption.parentElement).toHaveClass("border-purple-600");

		// Deselect an option
		fireEvent.click(firstOption);
		expect(firstOption.parentElement).not.toHaveClass("border-purple-600");
		expect(secondOption.parentElement).toHaveClass("border-purple-600");
	});
});
