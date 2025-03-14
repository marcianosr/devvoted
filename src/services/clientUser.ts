"use client";

import { createClient } from "@/app/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User as DevvotedUser } from "@/types/db";

export type AuthenticatedUser = SupabaseUser & {
	devvotedUser: DevvotedUser;
};

export const getClientUser = async (): Promise<AuthenticatedUser | null> => {
	const supabase = createClient();

	const { data: session, error } = await supabase.auth.getSession();

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
