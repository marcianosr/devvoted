import { db } from "@/database/db";
import { pollUserPerformanceTable } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export const getUserPerformanceData = async (
	userId: string,
	categoryCode: string
) => {
	try {
		const data = await db
			.select()
			.from(pollUserPerformanceTable)
			.where(
				and(
					eq(pollUserPerformanceTable.user_id, userId),
					eq(pollUserPerformanceTable.category_code, categoryCode)
				)
			)
			.limit(1);

		// Return the first item if it exists, otherwise return null
		return data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error("Error fetching user performance:", error);
		throw new Error("Database query failed");
	}
};
