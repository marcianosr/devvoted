"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import classNames from "classnames";

export default function PollPage() {
	const { user, loading } = useAuth();
	const params = useParams();
	const pollId = params.id;

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<section className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Poll {pollId}</h1>

			<button
				disabled={!user}
				className={classNames(
					"flex items-center space-x-2 px-6 py-2 border rounded-lg shadow-sm",
					{ "opacity-50 cursor-not-allowed": !user }
				)}
			>
				Submit
			</button>
		</section>
	);
}
