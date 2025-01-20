import { vi } from "vitest";

vi.mock("firebase/auth", () => ({
	getAuth: vi.fn(),
	signOut: vi.fn(),
	onAuthStateChanged: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
	auth: {
		currentUser: null,
	},
}));
