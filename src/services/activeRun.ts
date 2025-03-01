import { createClient } from "@/app/supabase/server";
import { ActiveRun } from "@/types/db";

export const getActiveRun = async (
	userId: string
): Promise<ActiveRun | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("active_runs")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		console.error(error);
		return null;
	}

	return data;
};
