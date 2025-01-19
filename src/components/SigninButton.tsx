type SignInButtonProps = {
	onSignIn: () => Promise<void>;
	loading: boolean;
	error?: string;
};

const SignInButton = ({ onSignIn, loading, error }: SignInButtonProps) => (
	<div className="flex flex-col items-center space-y-4">
		<button
			onClick={onSignIn}
			disabled={loading}
			className={
				"flex items-center space-x-2 px-6 py-2 border rounded-lg shadow-sm"
			}
		>
			<img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
			<span>{loading ? "Signing in..." : "Sign in with Google"}</span>
		</button>
		{error && <p className="text-red-500 text-sm">{error}</p>}
	</div>
);

export default SignInButton;
