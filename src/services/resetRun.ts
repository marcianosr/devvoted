import { startRunSettings } from "./constants";
import { SupabaseClient } from "@supabase/supabase-js";

export const resetActiveRunByAllCategories = async ({
	supabase,
	userId,
}: {
	supabase: SupabaseClient;
	userId: string;
}) => {
	const { error: pollsActiveRunError } = await supabase
		.from("polls_active_runs")
		.delete()
		.eq("user_id", userId);

	if (pollsActiveRunError)
		throw new Error(
			`Error resetting active run: ${pollsActiveRunError.message}`
		);

	const { error: userError } = await supabase
		.from("users")
		.update({
			active_config: null,
		})
		.eq("id", userId);
	if (userError)
		throw new Error(`Error resetting active run: ${userError.message}`);

	return { success: true };
};

export const resetActiveRunByCategoryCode = async ({
	supabase,
	userId,
	categoryCode,
}: {
	supabase: SupabaseClient;
	userId: string;
	categoryCode: string;
}) => {
	const { error } = await supabase
		.from("polls_active_runs")
		.update({ ...startRunSettings, last_poll_at: new Date() })
		.eq("category_code", categoryCode)
		.eq("user_id", userId);
	if (error) throw new Error(`Error resetting active run: ${error.message}`);

	return { success: true };
};
