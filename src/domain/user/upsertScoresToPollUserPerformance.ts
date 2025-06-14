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

	// Fetch the updated data to log it
	const { data } = await supabase
		.from("polls_user_performance")
		.select("*")
		.eq("user_id", user_id)
		.eq("category_code", category_code)
		.single();

	if (error) {
		console.error(
			`Error upserting poll user performance: ${error.message}`
		);
		throw new Error(
			`Error inserting poll user performance: ${error.message}`
		);
	}

	console.log("Successfully upserted poll user performance:");
	console.log(data);
};
