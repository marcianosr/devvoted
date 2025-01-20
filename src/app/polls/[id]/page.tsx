"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

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

			<Button
				disabled={!user}
				variant="primary"
			>
				Submit
			</Button>
		</section>
	);
}
