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
		<div className="max-w-sm mx-auto mt-8">
			<div className=" p-6 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-4">Development Login</h2>
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}
				<div className="mb-4">
					<p className="text-gray-600">Email: {DEV_EMAIL}</p>
					<p className="text-gray-600">Password: {DEV_PASSWORD}</p>
				</div>
				<button
					onClick={handleDevLogin}
					disabled={loading}
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? "Logging in..." : "Development Login"}
				</button>
			</div>
		</div>
	);
}
