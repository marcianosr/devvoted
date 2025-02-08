import { createClient } from "@/app/supabase/server";
import { Poll } from "@/types/db";

export const getPoll = async (pollId: string): Promise<Poll | null> => {
	const supabase = createClient();

	const { data, error } = await (await supabase)
		.from("polls")
		.select("*")
		.eq("id", pollId)
		.single();

	if (error) {
		console.error(error);
		return null;
	}

	return data;
};
