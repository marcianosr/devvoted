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
	pollId: string,
	userId?: string
): Promise<{ poll: Poll | null; options: PollOption[]; userSelectedOptions: string[] }> => {
	const supabase = await createClient();

	const { data: pollData, error: pollError } = await supabase
		.from("polls")
		.select("*, polls_options(*)")
		.eq("id", pollId)
		.single();

	if (pollError) {
		console.error("Error fetching poll with options:", pollError);
		return { poll: null, options: [], userSelectedOptions: [] };
	}

	if (!userId) {
		return { poll: pollData, options: pollData.polls_options || [], userSelectedOptions: [] };
	}

	// Get user's responses
	const { data: responseData, error: responseError } = await supabase
		.from("polls_responses")
		.select("*, polls_response_options(option_id)")
		.eq("poll_id", pollId)
		.eq("user_id", userId)
		.single();

	if (responseError && responseError.code !== "PGRST116") { // PGRST116 is "no rows returned"
		console.error("Error fetching user responses:", responseError);
	}

	const userSelectedOptions = responseData?.polls_response_options?.map(
		(ro: { option_id: number }) => ro.option_id.toString()
	) || [];

	return {
		poll: pollData,
		options: pollData.polls_options || [],
		userSelectedOptions,
	};
};
