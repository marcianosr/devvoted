"use client";

import { createClient } from "@/app/supabase/client";
import { useState } from "react";
import Button from "@/components/ui/Button";

const GoogleLoginButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClient();

	const handleLogin = async () => {
		setIsLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI,
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
				},
			});

			if (error) throw error;

			if (data?.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("❌ Google Login Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button onClick={handleLogin} disabled={isLoading}>
			{isLoading ? "Signing in..." : "Sign in with Google"}
		</Button>
	);
};

export default GoogleLoginButton;
