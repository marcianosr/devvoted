// import { eq } from "drizzle-orm";
import { pollOptionsTable, pollsTable, usersTable } from "@/database/schema";
import { db } from "@/database/db";
import { Poll, PollOption, User } from "@/types/db";

const DEV_UID = "f40d940b-9d3b-47f3-a73a-4dfba18b20c2";

const user = {
	id: DEV_UID,
	display_name: "Devvoted",
	email: "devvoted@devvoted.com",
	photo_url: null,
	roles: "admin" as const,
	total_polls_submitted: 0,
	active_config: null,
} satisfies Partial<User>;

const polls: Poll[] = [
	{
		id: 1,
		question:
			"In CSS, the “*” selector does exist, what effects of this selector can you list?",
		status: "open",
		created_by: user.id,
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
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
	},
	{
		id: 3,
		question:
			"What is the best programming language in 2024, can you share?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
	},
	{
		id: 4,
		question: "What is the best framework for Node.js?",
		status: "open",
		created_by: user.id,
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
	{
		id: 8,
		poll_id: 3,
		option: "Option 1",
		is_correct: false,
	},
	{
		id: 9,
		poll_id: 3,
		option: "Option 2",
		is_correct: false,
	},
	{
		id: 10,
		poll_id: 3,
		option: "Option 3",
		is_correct: true,
	},
	{
		id: 11,
		poll_id: 4,
		option: "Option 1",
		is_correct: false,
	},
	{
		id: 12,
		poll_id: 4,
		option: "Option 2",
		is_correct: false,
	},
	{
		id: 13,
		poll_id: 4,
		option: "Option 3",
		is_correct: false,
	},
	{
		id: 14,
		poll_id: 4,
		option: "Option 4",
		is_correct: true,
	},
	{
		id: 15,
		poll_id: 4,
		option: "Option 5",
		is_correct: false,
	},
];

async function main() {
	console.log("🌱 Starting to seed database...");

	try {
		console.log("🌱 Creating development user...");

		await db
			.insert(usersTable)
			.values(user)
			.returning({ id: usersTable.id });

		console.log("🌱 Creating polls...");

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
