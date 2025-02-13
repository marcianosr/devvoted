// import { eq } from "drizzle-orm";
import {
	pollOptionsTable,
	pollsTable,
} from "@/database/schema";
import { db } from "@/database/db";
import { Poll, PollOption } from "@/types/db";

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
	},
];

const pollOptions: PollOption[] = [
	{
		id: 1,
		poll_id: 1,
		option: "Option 1",
		is_correct: false,
	},
	{
		id: 2,
		poll_id: 1,
		option: "Option 2",
		is_correct: false,
	},
	{
		id: 3,
		poll_id: 1,
		option: "Option 3",
		is_correct: false,
	},
	{
		id: 4,
		poll_id: 2,
		option: "Option 1",
		is_correct: false,
	},
	{
		id: 5,
		poll_id: 2,
		option: "Option 2",
		is_correct: false,
	},
	{
		id: 6,
		poll_id: 2,
		option: "Option 3",
		is_correct: true,
	},
	{
		id: 7,
		poll_id: 2,
		option: "Option 4",
		is_correct: false,
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

		await db
			.insert(pollOptionsTable)
			.values(pollOptions)
			.returning({ id: pollOptionsTable.id });

		console.log("🌱 Seeding complete!");

		process.exit(0);
	} catch (error) {
		console.error("Error during seeding:", error);
		process.exit(1);
	}
}

main();
