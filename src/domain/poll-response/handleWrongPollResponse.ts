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

	// when XP category hits 0, reset active run
	// await resetActiveRunByAllCategories({ supabase, userId });

	return { newXP };
};
