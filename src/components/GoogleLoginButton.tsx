"use client";

import { createClient } from "@/app/supabase/client";

const GoogleLoginButton = () => {
	const supabase = createClient();

	const handleLogin = async () => {
		console.log(" Signing in with Google...");
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `http://localhost:3000/api/auth/callback`,
			},
		});
	};

	return <button onClick={handleLogin}>Sign in with Google</button>;
};

export default GoogleLoginButton;
