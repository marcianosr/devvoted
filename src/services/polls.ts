import { createClient as createServerClient } from "@/app/supabase/server";
import { createClient as createBrowserClient } from "@/app/supabase/client";
import { Poll, PollOption } from "@/types/db";

export const getPoll = async (pollId: string): Promise<Poll | null> => {
	const supabase = createServerClient();

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

export const getPollWithOptions = async (
	pollId: string
): Promise<{ poll: Poll | null; options: PollOption[] }> => {
	const supabase = createServerClient();

	const { data, error } = await (await supabase)
		.from("polls")
		.select("*, polls_options(*)")
		.eq("id", pollId)
		.single();

	console.log(data, error);
	if (error) {
		console.error("Error fetching poll with options:", error);
		return { poll: null, options: [] };
	}

	return { poll: data, options: data.polls_options || [] };
};

export const submitPollResponse = async (
	pollId: string,
	userId: string,
	selectedOptions: string[]
): Promise<{ success: boolean }> => {
	const supabase = createBrowserClient();

	const { error } = await supabase
		.from("polls_responses")
		.insert([
			{
				poll_id: pollId,
				user_id: userId,
				selected_options: selectedOptions,
			},
		])
		.select()
		.single();

	if (error) {
		console.error("Error submitting poll response:", error);
		return { success: false };
	}

	return { success: true };
};
