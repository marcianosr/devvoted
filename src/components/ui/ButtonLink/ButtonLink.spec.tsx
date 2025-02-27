import { render, screen } from "@testing-library/react";
import ButtonLink from "./ButtonLink";
import { describe, expect, test } from "vitest";

describe(ButtonLink, () => {
	test("renders as a link when href is provided", () => {
		render(<ButtonLink href="/test">Test Link</ButtonLink>);
		const linkElement = screen.getByText(/Test Link/i);
		expect(linkElement).toBeInTheDocument();
		expect(linkElement.closest("a")).toHaveAttribute("href", "/test");
	});

	test("renders as an external link when external is true", () => {
		render(
			<ButtonLink href="https://devvoted.com" external>
				External Link
			</ButtonLink>
		);
		const linkElement = screen.getByText(/External Link/i);
		expect(linkElement).toBeInTheDocument();
		expect(linkElement.closest("a")).toHaveAttribute(
			"href",
			"https://devvoted.com"
		);
		expect(linkElement.closest("a")).toHaveAttribute("target", "_blank");
	});

	test("renders as a button when no href is provided", () => {
		render(<ButtonLink>Test Button</ButtonLink>);
		const buttonElement = screen.getByText(/Test Button/i);
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement.closest("button")).toBeInTheDocument();
	});
});
