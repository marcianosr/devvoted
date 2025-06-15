import { createClient } from "@/app/supabase/client";
import { createClient as createServerClient } from "@/app/supabase/server";
import Auth from "@/domain/user/components/Auth";
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
		<div>
			<div>
				{session ? (
					<div>
						<div>
							<h1>Welcome back!</h1>
							<LogoutButton />
						</div>
						<pre>{JSON.stringify(polls, null, 2)}</pre>
					</div>
				) : (
					<Auth />
				)}
			</div>
		</div>
	);
}
