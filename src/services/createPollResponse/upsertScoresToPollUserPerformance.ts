import { UpdateUserPerformance } from "@/types/db";
import { SupabaseClient } from "@supabase/supabase-js";

type UpsertScoresToPollUserPerformanceFn = {
	supabase: SupabaseClient;
} & UpdateUserPerformance;
export const upsertScoresToPollUserPerformance = async ({
	supabase,
	user_id,
	category_code,
	devvoted_score,
	betting_average,
}: UpsertScoresToPollUserPerformanceFn) => {
	const { error } = await supabase.from("polls_user_performance").upsert(
		{
			user_id,
			category_code,
			devvoted_score,
			betting_average,
		},
		{
			onConflict: "user_id, category_code",
		}
	);

	if (error)
		throw new Error(
			`Error inserting poll user performance: ${error.message}`
		);
};
