import { createClient } from "@/app/supabase/server";
import { getUserPerformanceData } from "./getUserPerformanceData";
import { calculateDevvotedScore } from "@/services/devvotedScore";

type UpsertScoresToPollUserPerformanceParams = {
	supabase: Awaited<ReturnType<typeof createClient>>;
	user_id: string;
	category_code: string;
	betting_average: string;
};

/**
 * Upserts scores to the polls_user_performance table
 * 
 * This function calculates and updates the devvoted score based on the user's performance
 * using the formula: Accuracy × Streak Multiplier × Betting Multiplier
 * 
 * @param params - Parameters for upserting scores
 * @returns The calculated devvoted score
 */
export const upsertScoresToPollUserPerformance = async ({
	supabase,
	user_id,
	category_code,
	betting_average,
}: UpsertScoresToPollUserPerformanceParams): Promise<number> => {
	try {
		console.log(" Upserting scores for user:", { user_id, category_code, betting_average });
		
		// Get user performance data to retrieve current streak multiplier
		const userPerformanceData = await getUserPerformanceData(
			user_id,
			category_code
		);
		
		console.log(" User performance data:", userPerformanceData);
		
		// Get the current streak multiplier from the active run
		// This is more accurate than the best_multiplier stored in user performance
		const { data: runData } = await supabase
			.from("polls_runs")
			.select("streak_multiplier")
			.eq("user_id", user_id)
			.eq("category_code", category_code)
			.order("last_poll_at", { ascending: false })
			.limit(1)
			.single();
			
		console.log(" Current run data:", runData);
		
		const currentStreakMultiplier = runData?.streak_multiplier 
			? parseFloat(runData.streak_multiplier) 
			: userPerformanceData?.best_multiplier 
				? parseFloat(userPerformanceData.best_multiplier) 
				: 0.1;
				
		console.log(" Using streak multiplier:", currentStreakMultiplier);
		
		// Calculate the devvoted score based on the formula
		const devvotedScore = await calculateDevvotedScore({
			userId: user_id,
			categoryCode: category_code,
			currentStreakMultiplier,
			bettingAverage: parseFloat(betting_average),
		});
		
		console.log(" Calculated devvoted score:", devvotedScore);
		
		// Update the user performance data with the calculated devvoted score
		const { error } = await supabase.from("polls_user_performance").upsert(
			{
				user_id,
				category_code,
				devvoted_score: devvotedScore.toFixed(2),
				betting_average,
			},
			{
				onConflict: "user_id, category_code",
			}
		);

		if (error) {
			console.error(" Error upserting user performance:", error);
			throw new Error(
				`Error inserting poll user performance: ${error.message}`
			);
		}
		
		console.log(" Successfully updated devvoted score:", devvotedScore);
			
		return devvotedScore;
	} catch (error) {
		console.error("Error in upsertScoresToPollUserPerformance:", error);
		throw error;
	}
};
