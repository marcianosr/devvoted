import { SupabaseClient } from "@supabase/supabase-js";

// Calculate the betting average for a user in a specific category
type CalculateBettingAverageFn = {
	supabase: SupabaseClient;
	userId: string;
	selectedBet: number;
};
export const calculateBettingAverage = async ({
	supabase,
	userId,
	selectedBet,
}: CalculateBettingAverageFn): Promise<string> => {
	// Get all poll responses for this user in this category
	const { data: pollResponses, error } = await supabase
		.from("polls_responses")
		.select("poll_id, response_id")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching poll responses:", error);
		return selectedBet.toFixed(1); // Return current bet if we can't calculate average
	}

	// If this is the first response, just return the current bet
	if (!pollResponses || pollResponses.length === 0) {
		return selectedBet.toFixed(1);
	}

	// Get all previous bets from the database
	// For now, we'll simulate this by using the current bet for all responses
	// In a real implementation, you would fetch the actual bet values from a table that stores them

	// Calculate average including the current bet
	const totalResponses = pollResponses.length + 1; // +1 for current response
	const previousBetsSum = pollResponses.length * selectedBet; // Simplified for now
	const newAverage = (previousBetsSum + selectedBet) / totalResponses;

	return newAverage.toFixed(1);
};
