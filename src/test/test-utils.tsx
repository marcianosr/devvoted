import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";
import { AuthContext } from "@/context/AuthContext";
import { vi } from "vitest";
import { User } from "firebase/auth";

export const defaultUser: Partial<User> = {
	displayName: "Test User",
	email: "test@example.com",
	uid: "test-uid",
	photoURL: "https://example.com/photo.jpg",
} as const;

type RenderWithAuthOptions = {
	user?: Partial<User> | null;
	loading?: boolean;
} & Omit<RenderOptions, "wrapper">;

export const renderWithAuth = (
	ui: ReactElement,
	{
		user = defaultUser,
		loading = false,
		...renderOptions
	}: RenderWithAuthOptions = {}
) => {
	const mockLogout = vi.fn();
	const mockUser = user ? { ...defaultUser, ...user } : null;

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<AuthContext.Provider
			value={{
				user: mockUser as User,
				loading,
				logout: mockLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);

	return {
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
		mockLogout,
		mockUser,
	};
};
