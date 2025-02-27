import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Title from "@/components/ui/Title/Title";

describe(Title, () => {
	it("renders children correctly", () => {
		render(<Title>Hello World</Title>);
		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});

	it("renders as h1 by default", () => {
		render(<Title>Main Title</Title>);
		const title = screen.getByText("Main Title");
		expect(title.tagName).toBe("H1");
	});

	it("renders as h2 when specified", () => {
		render(<Title as="h2">Section Title</Title>);
		const title = screen.getByText("Section Title");
		expect(title.tagName).toBe("H2");
	});
});
