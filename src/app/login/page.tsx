import { createClient } from "@/app/supabase/client";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default async function Login() {
	const supabase = createClient();
	return (
		<section>
			<GoogleLoginButton />
		</section>
	);
}
