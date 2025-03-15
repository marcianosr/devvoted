import { db } from "@/database/db";
import { pollUserPerformanceTable } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export const getUserPerformanceData = async (
	userId: string,
	categoryCode: string
) => {
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
	return data;
};
