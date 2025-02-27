"use client";

import { createClient } from "@/app/supabase/client";
import { User } from "@supabase/supabase-js";

type DevvotedUser = {
	id: string;
	active_config: string | null;
	created_at: string;
};

export type AuthenticatedUser = User & {
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
