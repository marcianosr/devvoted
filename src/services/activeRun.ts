import { createClient } from "@/app/supabase/server";
import { ActiveRun } from "@/types/db";

export const getActiveRun = async (
	userId: string,
	categoryCode: string
): Promise<ActiveRun | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("active_runs")
		.select("*")
		.eq("category_code", categoryCode)
		.eq("user_id", userId)
		.limit(1)
		.maybeSingle();

	if (error && error.code !== "PGRST116") {
		console.error("Error fetching active run:", error);
		return null;
	}

	return data;
};
