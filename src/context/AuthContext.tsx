"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	logout: async () => {},
});

type AuthProviderProps = {
	children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider };
export function useAuth() {
	return useContext(AuthContext);
}
