import { createClient } from "@/app/supabase/server";

export const getUser = async () => {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await (await supabase).auth.getUser();

	if (error) {
		console.error("Error fetching user:", error);
		return null;
	}

	return user;
};
