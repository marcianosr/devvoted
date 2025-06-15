import Button from "./ui/Button";

type SignInButtonProps = {
	onSignIn: () => Promise<void>;
	loading: boolean;
	error?: string;
};

const SignInButton = ({ onSignIn, loading, error }: SignInButtonProps) => (
	<div>
		<button
			onClick={onSignIn}
			disabled={loading}
		>
			<div>
				<img src="/google-icon.svg" alt="Google" />
				<span>{loading ? "Signing in..." : "Sign in with Google"}</span>
			</div>
		</button>
		{error && <p>{error}</p>}
	</div>
);

export default SignInButton;
