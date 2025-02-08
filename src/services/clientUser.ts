"use client";

import { createClient } from "@/app/supabase/client";

export const getClientUser = async () => {
	const supabase = createClient();

	const { data: session, error } = await supabase.auth.getSession(); // ✅ Correct way to get client session

	if (error || !session?.session) {
		console.error("Error fetching client user:", error);
		return null;
	}

	return session.session.user; // ✅ Fix: Get the user from session
};
