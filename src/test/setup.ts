import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

beforeEach(() => {
	vi.clearAllMocks();
});

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
	createClient: vi.fn(),
}));

// Mock Next.js router
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		refresh: vi.fn(),
	}),
}));
