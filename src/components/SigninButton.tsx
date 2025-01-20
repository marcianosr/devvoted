import Button from "./ui/Button";

type SignInButtonProps = {
	onSignIn: () => Promise<void>;
	loading: boolean;
	error?: string;
};

const SignInButton = ({ onSignIn, loading, error }: SignInButtonProps) => (
	<div className="flex flex-col items-center space-y-4">
		<Button
			onClick={onSignIn}
			disabled={loading}
			variant="secondary"
			size="lg"
		>
			<div className="flex items-center space-x-2">
				<img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
				<span>{loading ? "Signing in..." : "Sign in with Google"}</span>
			</div>
		</Button>
		{error && <p className="text-red-500 text-sm">{error}</p>}
	</div>
);

export default SignInButton;
