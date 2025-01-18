import { useState } from "react";
import { signInWithGoogle } from "../../lib/firebase";
import { User } from "firebase/auth";

export default function GoogleSignIn() {
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setLoading(true);
			setError("");
			const signedInUser = await signInWithGoogle();
			setUser(signedInUser);
		} catch (err) {
			setError("Failed to sign in with Google");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (user) {
		return (
			<div className="flex items-center space-x-4 p-4">
				{user.photoURL && (
					<img
						src={user.photoURL}
						alt={user.displayName || "User"}
						className="w-10 h-10 rounded-full"
					/>
				)}
				<div>
					<p className="font-medium">{user.displayName}</p>
					<p className="text-sm text-gray-500">{user.email}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center space-y-4">
			<button
				onClick={handleSignIn}
				disabled={loading}
				className={`flex items-center space-x-2 px-6 py-2 border rounded-lg shadow-sm
          ${
				loading
					? "bg-gray-100 cursor-not-allowed"
					: "bg-white hover:bg-gray-50"
			}`}
			>
				<img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
				<span>{loading ? "Signing in..." : "Sign in with Google"}</span>
			</button>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}
