import { createClient } from "@/app/supabase/client";

export default async function Home() {
	const supabase = createClient();

	const { data: polls, ...rest } = await supabase.from("polls").select("*");
	console.log({ polls, rest });
	return <pre className="flex font-black">{JSON.stringify(polls)}</pre>;
}
