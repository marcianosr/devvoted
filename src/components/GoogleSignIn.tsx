import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import SignInButton from "@/components/SigninButton";

export default function GoogleSignIn() {
	const { handleSignIn, loading, error } = useGoogleSignIn();

	return (
		<SignInButton onSignIn={handleSignIn} loading={loading} error={error} />
	);
}
