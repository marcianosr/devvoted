import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Text, { SmallText } from "@/components/ui/Text/Text";

describe(Text, () => {
	it("renders children correctly", () => {
		render(<Text>Hello World</Text>);
		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});
});

describe("SmallText", () => {
	it("renders children correctly", () => {
		render(<SmallText>Small Text</SmallText>);
		expect(screen.getByText("Small Text")).toBeInTheDocument();
	});
});
