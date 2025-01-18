import type { NextPage } from "next";
import { useAuth } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";

const Home: NextPage = () => {
	const { user, loading, logout } = useAuth();

	console.log(user);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
			<h1 className="text-4xl font-bold mb-8">Devvoted</h1>
			<GoogleSignIn />
			{user && (
				<>
					<p className="mt-4 text-green-600">
						Successfully signed in as {user.email}
					</p>
					<button onClick={logout}>Signout</button>
				</>
			)}
		</div>
	);
};

export default Home;
