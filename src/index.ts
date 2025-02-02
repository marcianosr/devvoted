// import { eq } from "drizzle-orm";
import { pollsTable } from "@/database/schema";
import { db } from "@/database/db";
import { Poll } from "@/types/db";

const polls: Poll[] = [
	{
		id: 1,
		question:
			"In CSS, the “*” selector does exist, what effects of this selector can you list?",
		status: "open",
		created_by: 1,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		responses: "[]",
	},
	{
		id: 2,
		question:
			"In JS, closures are there, what do you know about it, can you share?",
		status: "draft",
		created_by: 1,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		responses: "[]",
	},
];

async function main() {
	console.log("🌱 Starting to seed database...");

	try {
		console.log("🌱 Creating a new poll...");

		await db
			.insert(pollsTable)
			.values(polls)
			.returning({ id: pollsTable.id });

		console.log("🌱 Seeding complete!");

		process.exit(0);
	} catch (error) {
		console.error("Error during seeding:", error);
		process.exit(1);
	}
}

main();
