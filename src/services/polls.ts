import { createClient } from "@/app/supabase/server";
import { Poll, PollOption } from "@/types/db";

export const getPoll = async (pollId: string): Promise<Poll | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
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

export const getPollWithOptions = async (
	pollId: string
): Promise<{ poll: Poll | null; options: PollOption[] }> => {
	const supabase = await createClient();

	console.log("🔥 Getting poll with ID from server:", pollId);

	const { data, error } = await supabase
		.from("polls")
		.select("*, polls_options(*)")
		.eq("id", pollId)
		.single();

	if (error) {
		console.error("Error fetching poll with options:", error);
		return { poll: null, options: [] };
	}

	return { poll: data, options: data.polls_options || [] };
};
