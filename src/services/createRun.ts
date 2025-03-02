import { createClient } from "@/app/supabase/server";
import { CreatePostRunRequest } from "@/services/api/createPostRunRequest";
import { InsertActiveRun, PollCategory } from "@/types/db";

export const createRun = async ({
	userId,
	configId,
}: CreatePostRunRequest): Promise<void> => {
	try {
		const categories = await getCategories();

		await insertActiveRun(userId, categories);
		await updateUserConfig(userId, configId);
	} catch (error) {
		console.error("Error creating run:", error);
		throw new Error(`Failed to create run: ${error.message}`);
	}
};

const insertActiveRun = async (userId: string, categories: PollCategory[]) => {
	const supabase = createClient();

	// Insert active runs for each category
	const activeRuns: Partial<InsertActiveRun>[] = categories.map(
		(category) => ({
			user_id: userId,
			category_code: category.code,
			current_streak: 0,
			streak_multiplier: "0.0",
			started_at: new Date(),
			temporary_xp: 0,
		})
	);

	const { error } = await (await supabase)
		.from("active_runs")
		.insert(activeRuns);

	if (error) {
		throw new Error(`Failed to create active runs: ${error.message}`);
	}
};

const updateUserConfig = async (userId: string, configId: string) => {
	const supabase = createClient();

	const { data, error } = await (
		await supabase
	)
		.from("users")
		.update({
			active_config: configId,
		})
		.eq("id", userId)
		.single();

	if (error) {
		throw new Error(`Failed to update user config: ${error.message}`);
	}

	return data;
};

const getCategories = async (): Promise<PollCategory[]> => {
	const supabase = await createClient();
	const { data: categories, error } = await supabase
		.from("polls_categories")
		.select("*");

	if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
	if (!categories) throw new Error("No categories found");

	return categories;
};
