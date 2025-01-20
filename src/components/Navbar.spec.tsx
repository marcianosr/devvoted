import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithAuth } from "@/test/test-utils";
import Navbar from "@/components/Navbar";

describe(Navbar, () => {
	it("shows brand name", () => {
		renderWithAuth(<Navbar />);
		expect(screen.getByText("Devvoted")).toBeInTheDocument();
	});

	describe("when user is not logged in", () => {
		it("shows sign in button", () => {
			renderWithAuth(<Navbar />, { user: null });
			expect(
				screen.getByRole("button", { name: /sign in/i })
			).toBeInTheDocument();
		});

		it("does not show sign out button", () => {
			renderWithAuth(<Navbar />, { user: null });
			expect(
				screen.queryByRole("button", { name: /sign out/i })
			).not.toBeInTheDocument();
		});
	});

	describe("when user is logged in", () => {
		it("shows user profile and sign out button", () => {
			renderWithAuth(<Navbar />, {
				user: { displayName: "Custom User" },
			});
			expect(screen.getByText("Custom User")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /sign out/i })
			).toBeInTheDocument();
		});

		it("does not show sign in button", () => {
			renderWithAuth(<Navbar />);
			expect(
				screen.queryByRole("button", { name: /sign in/i })
			).not.toBeInTheDocument();
		});
	});
});
