import { ActiveRun, UpdateActiveRun } from "@/types/db";
import { createClient } from "@/app/supabase/server";

export const getPreviousRunDataByCategoryCode = async (
	userId: string,
	categoryCode: string
): Promise<ActiveRun | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("polls_active_runs")
		.select("*")
		.eq("user_id", userId)
		.eq("category_code", categoryCode)
		.limit(1)
		.maybeSingle<ActiveRun>();

	if (error)
		throw new Error(`Error getting previous streak: ${error.message}`);

	return data;
};

export const updateActiveRunByCategoryCode = async (
	activeRun: Partial<UpdateActiveRun>,
	categoryCode: string
) => {
	const supabase = await createClient();

	const { error } = await supabase
		.from("polls_active_runs")
		.update(activeRun)
		.eq("category_code", categoryCode)
		.eq("user_id", activeRun.user_id);

	if (error) throw new Error(`Error creating active run: ${error.message}`);
};
