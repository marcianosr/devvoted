import { createClient } from "@/app/supabase/client";

export default async function Home() {
	const supabase = createClient();

	const { data: polls } = await supabase.from("polls").select();

	return (
		<pre className="flex font-black">
			{JSON.stringify(polls)}
		</pre>
	);
}
