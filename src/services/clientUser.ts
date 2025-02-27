"use client";

import { createClient } from "@/app/supabase/client";

export const getClientUser = async () => {
	const supabase = createClient();

	const { data: session, error } = await supabase.auth.getSession(); // ✅ Correct way to get client session

	if (error || !session?.session) {
		console.error("Error fetching client user:", error);
		return null;
	}

	const { data: user, error: userError } = await supabase
		.from("users")
		.select("*")
		.eq("id", session.session.user.id)
		.single();

	if (userError) {
		console.error("Error fetching client user:", userError);
		return null;
	}

	return {
		devvotedUser: user,
		...session.session.user,
	};
};
