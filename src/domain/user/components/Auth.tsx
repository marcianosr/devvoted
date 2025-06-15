import { EmailPasswordAuth } from "./EmailPasswordAuth";
import GoogleLoginButton from "./GoogleLoginButton";

const AuthComponent =
	process.env.NODE_ENV === "development"
		? EmailPasswordAuth
		: GoogleLoginButton;

export default AuthComponent;
