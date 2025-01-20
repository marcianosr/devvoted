import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe(Button, () => {
	it("renders with primary variant by default", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toHaveClass("bg-blue-600");
	});

	it("renders with secondary variant", () => {
		render(<Button variant="secondary">Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toHaveClass("bg-gray-100");
	});

	it("renders with different sizes", () => {
		const { rerender } = render(<Button size="sm">Click me</Button>);
		let button = screen.getByRole("button", { name: /click me/i });
		expect(button).toHaveClass("h-8");

		rerender(<Button size="lg">Click me</Button>);
		button = screen.getByRole("button", { name: /click me/i });
		expect(button).toHaveClass("h-12");
	});
});
