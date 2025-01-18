import { useState } from "react";
import { signInWithGoogle } from "../../lib/firebase";

export const useGoogleSignIn = () => {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setLoading(true);
			setError("");
			await signInWithGoogle();
		} catch (err) {
			setError("Failed to sign in with Google");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return { handleSignIn, loading, error };
};
