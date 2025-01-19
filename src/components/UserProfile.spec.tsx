import { render } from "@testing-library/react";
import UserProfile from "./UserProfile";
import { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";

const mockUser: User = {
	uid: "123",
	email: "test@example.com",
	displayName: "Test User",
	photoURL: "https://example.com/photo.jpg",
	emailVerified: true,
	isAnonymous: false,
	providerData: [],
	refreshToken: "",
	tenantId: null,
	delete: vi.fn(),
	getIdToken: vi.fn(),
	getIdTokenResult: vi.fn(),
	reload: vi.fn(),
	toJSON: vi.fn(),
	metadata: {
		creationTime: "123",
		lastSignInTime: "123",
	},
	phoneNumber: null,
	providerId: "",
};

describe(UserProfile, () => {
	it("renders user profile with photo", () => {
		const { getByAltText, getByText } = render(
			<UserProfile user={mockUser} />
		);
		expect(getByAltText("Test User")).toBeInTheDocument();
		expect(getByText("Test User")).toBeInTheDocument();
		expect(getByText("test@example.com")).toBeInTheDocument();
	});

	it("renders user profile without photo", () => {
		const userWithoutPhoto = { ...mockUser, photoURL: null };
		const { queryByAltText, getByText } = render(
			<UserProfile user={userWithoutPhoto} />
		);
		expect(queryByAltText("Test User")).not.toBeInTheDocument();
		expect(getByText("Test User")).toBeInTheDocument();
		expect(getByText("test@example.com")).toBeInTheDocument();
	});
});
