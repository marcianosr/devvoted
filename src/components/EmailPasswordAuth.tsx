"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/supabase/client";
import { getOrCreateUser } from "@/services/auth";

const DEV_EMAIL = "dev@devvoted.com";
const DEV_PASSWORD = "devvoted123";

export const EmailPasswordAuth = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const handleDevLogin = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase.auth.signInWithPassword({
				email: DEV_EMAIL,
				password: DEV_PASSWORD,
			});

			if (error) throw error;

			if (data.user) {
				await getOrCreateUser(data.user);
				router.refresh();
			}
		} catch (error) {
			console.error("Error signing in:", error);
			setError(
				error instanceof Error ? error.message : "Failed to sign in"
			);
		} finally {
			setLoading(false);
		}
	};

	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div>
			<div>
				<h2>Development Login</h2>
				{error && (
					<div>
						<p>{error}</p>
					</div>
				)}
				<div>
					<p>Email: {DEV_EMAIL}</p>
					<p>Password: {DEV_PASSWORD}</p>
				</div>
				<button onClick={handleDevLogin} disabled={loading}>
					{loading ? "Signing in..." : "Development Login"}
				</button>
			</div>
		</div>
	);
};
