import { Poll, PollOption } from "@/types/db";
import { User } from "@supabase/supabase-js";

export type PollSubmissionProps = {
	poll: Poll;
	options: PollOption[];
	user: User | null;
	userSelectedOptions: string[];
};

export type SubmitPollResponseParams = {
	pollId: string;
	userId: string;
	selectedOptions: string[];
};
