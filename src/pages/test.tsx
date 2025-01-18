import type { NextPage } from "next";
import GoogleSignIn from "../components/GoogleSignIn";

const Test: NextPage = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
						Welcome to Devvoted
					</h1>
					<p className="mt-3 text-xl text-gray-500">
						Please sign in to continue
					</p>
					<div className="mt-10">
						<GoogleSignIn />
					</div>
				</div>
			</main>
		</div>
	);
};

export default Test;
