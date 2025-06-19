import {
	resetActiveRunByAllCategories,
	resetActiveRunByCategoryCode,
} from "@/domain/run/resetRun";
import { SupabaseClient } from "@supabase/supabase-js";

export const handleWrongPollResponse = async ({
	supabase,
	userId,
	categoryCode,
	selectedBet = 100, // Default to 100% if not provided
}: {
	supabase: SupabaseClient;
	userId: string;
	categoryCode: string;
	selectedBet?: number;
}): Promise<{ newXP: number }> => {
	const { newXP } = await resetActiveRunByCategoryCode({
		supabase,
		userId,
		categoryCode,
		selectedBet,
	});

	if (newXP === 0) {
		const result = await resetActiveRunByAllCategories({
			supabase,
			userId,
		});

		console.log(result);

		// TODO: Handle logic here to reset the run based on XP meter
		// TODO: when XP category hits 0, reset active run, but update user_performance table with cumulative_Xp and best_xp
	}

	return { newXP };
};
