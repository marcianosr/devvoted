// import { eq } from "drizzle-orm";
import { pollsTable } from "@/database/schema";
import { db } from "@/database/db";

async function main() {
	console.log("🌱 Starting to seed database...");

	try {
		console.log("🌱 Creating a new poll...");
		const poll: typeof pollsTable.$inferInsert = {
			title: "Hello, World!",
			question: "What is the best framework?",
			status: "open",
			responses: "[]",
		};

		await db
			.insert(pollsTable)
			.values(poll)
			.returning({ id: pollsTable.id });

		console.log("🌱 Seeding complete!");

		process.exit(0);
	} catch (error) {
		console.error("Error during seeding:", error);
		process.exit(1);
	}
}

main();
