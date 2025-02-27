"use client";

import { createClient } from "@/app/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEV_EMAIL = "test@test.nl";
const DEV_PASSWORD = "test123";

export default function EmailPasswordAuth() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const handleDevLogin = async () => {
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: DEV_EMAIL,
				password: DEV_PASSWORD,
			});

			console.log(data, error);
			if (error) throw error;

			if (data.user) {
				router.refresh(); // Refresh the page to update session state
			}
		} catch (err: any) {
			setError(err.message);
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
					{loading ? "Logging in..." : "Development Login"}
				</button>
			</div>
		</div>
	);
}
