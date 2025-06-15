"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/app/supabase/client";
import { getOrCreateUser } from "@/domain/user/auth";
import { useState } from "react";
import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";

const GoogleLoginButton = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const handleSignIn = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI,
				},
			});

			if (error) throw error;

			const session = await supabase.auth.getSession();

			if (session.data.session?.user) {
				await getOrCreateUser(session.data.session.user);
				router.refresh();
			}
		} catch (error) {
			console.error("Error signing in:", error);
			setError("Failed to sign in with Google");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<ButtonLink onClick={handleSignIn} disabled={loading}>
				<div>
					<Image src="/google-icon.svg" alt="Google" />
					<span>
						{loading ? "Signing in..." : "Sign in with Google"}
					</span>
				</div>
			</ButtonLink>
			{error && <p>{error}</p>}
		</div>
	);
};

export default GoogleLoginButton;
