import { SupabaseClient } from "@supabase/supabase-js";

type GetPollOptionsFn = {
	supabase: SupabaseClient;
	pollId: number;
};

export const getPollOptions = async ({
	supabase,
	pollId,
}: GetPollOptionsFn) => {
	const { data, error } = await supabase
		.from("polls_options")
		.select("*")
		.eq("poll_id", pollId);
	if (error) throw new Error("Failed to fetch poll options");
	return data;
};
