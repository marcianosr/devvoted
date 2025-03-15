import { ActiveRun, UpdateActiveRun } from "@/types/db";
import { pollsActiveRunTable } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/database/db";

export const getRunDataByCategoryCode = async (
	userId: string,
	categoryCode: string
): Promise<ActiveRun | null> => {
	try {
		const data = await db
			.select()
			.from(pollsActiveRunTable)
			.where(
				and(
					eq(pollsActiveRunTable.user_id, userId),
					eq(pollsActiveRunTable.category_code, categoryCode)
				)
			)
			.limit(1);

		return data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error("Error fetching run data:", error);
		throw new Error("Database query failed");
	}
};

export const updateActiveRunByCategoryCode = async (
	activeRun: Partial<UpdateActiveRun>,
	categoryCode: string
) => {
	try {
		if (!activeRun.user_id)
			throw new Error("User ID is required for updating active run");

		const data = await db
			.update(pollsActiveRunTable)
			.set(activeRun)
			.where(
				and(
					eq(pollsActiveRunTable.category_code, categoryCode),
					eq(pollsActiveRunTable.user_id, activeRun.user_id)
				)
			)
			.returning();

		return data;
	} catch (error) {
		console.error("Error updating run data:", error);
		throw new Error("Database query failed");
	}
};
