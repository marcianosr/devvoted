import type { User } from "firebase/auth";
import { vi } from "vitest";

export const mockUser = {
	uid: "user123",
	email: "mario@nintendo.com",
	displayName: "Super Mario",
	emailVerified: true,
	isAnonymous: false,
	metadata: {
		creationTime: "2025-01-21T15:59:03.000Z",
		lastSignInTime: "2025-01-21T15:59:03.000Z",
	},
	providerData: [],
	refreshToken: "mock-refresh-token",
	tenantId: null,
	delete: vi.fn(),
	getIdToken: vi.fn(),
	getIdTokenResult: vi.fn(),
	reload: vi.fn(),
	toJSON: vi.fn(),
	phoneNumber: null,
	photoURL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=mario",
	providerId: "google",
} as User;

export const mockAuthContext = {
	user: mockUser,
	loading: false,
	error: null,
	logout: vi.fn(),
};
