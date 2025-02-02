import { createClient } from "@/app/supabase/client";
import { PollWithDetails } from "@/types/db";

export default async function Home() {
	const supabase = createClient();

	const { data: polls } = await supabase
		.from("polls")
		.select("*")
		.returns<PollWithDetails[]>();

	return <pre className="flex font-black">{JSON.stringify(polls)}</pre>;
}
