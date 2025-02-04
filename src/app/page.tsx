import { createClient } from "@/app/supabase/client";
import { createClient as createServerClient } from "@/app/supabase/server";
import Auth from "@/components/Auth";
import LogoutButton from "@/components/Logout";
import { PollWithDetails } from "@/types/db";

export default async function Home() {
	const supabase = createClient();
	const serverSupabase = await createServerClient();
	const {
		data: { session },
	} = await serverSupabase.auth.getSession();

	const { data: polls } = await supabase
		.from("polls")
		.select("*")
		.returns<PollWithDetails[]>();

	return (
		<div className="container mx-auto px-4">
			<div className="min-h-screen">
				{session ? (
					<div>
						<div className="flex justify-between items-center mb-4">
							<h1 className="text-2xl font-bold">
								Welcome back!
							</h1>
							<LogoutButton />
						</div>
						<pre className="p-4 rounded">
							{JSON.stringify(polls, null, 2)}
						</pre>
					</div>
				) : (
					<Auth />
				)}
			</div>
		</div>
	);
}
