import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";
import { describe, expect, it } from "vitest";
import { mockUser } from "@/test/mocks";

describe(UserProfile, () => {
	it("renders user information correctly", () => {
		render(<UserProfile user={mockUser} />);

		expect(screen.getByText(mockUser.displayName!)).toBeInTheDocument();
		expect(screen.getByText(mockUser.email!)).toBeInTheDocument();
	});

	it.skip("handles missing user data gracefully", () => {
		const incompleteUser = { ...mockUser, displayName: null, email: null };
		render(<UserProfile user={incompleteUser} />);

		expect(screen.getByText(/anonymous user/i)).toBeInTheDocument();
	});
});
