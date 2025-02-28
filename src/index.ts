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

const polls: Omit<Poll, "id">[] = [
	{
		question:
			"In CSS, the “*” selector does exist, what effects of this selector can you list?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
	},
	{
		question:
			"In JS, closures are there, what do you know about it, can you share?",
		status: "draft",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "js",
	},
	{
		question:
			"In React, development goes rapid, synthetic events are built-in, do you know why they are added?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "react",
	},
	{
		question:
			"In Frontend, content-theft is real, what approach can be used to prevent visitors to steal?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "general-frontend",
	},
];

const pollOptionsData = [
	["Option 1", false],
	["Option 2", false],
	["Option 3", false],
	["Option 1", false],
	["Option 2", false],
	["Option 3", true],
	["Option 4", false],
	["Option 1", false],
	["Option 2", false],
	["Option 3", true],
	["Option 1", false],
	["Option 2", false],
	["Option 3", false],
	["Option 4", true],
	["Option 5", false],
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

		const insertedPolls = await db
			.insert(pollsTable)
			.values(polls)
			.returning({ id: pollsTable.id });

		console.log("🌱 Creating poll options...");

		const pollOptions: Omit<PollOption, "id">[] = pollOptionsData.map(
			([option, is_correct], index) => {
				const poll_id = insertedPolls[Math.floor(index / 4)].id; // 4 options per poll (except last one has 5)
				return {
					poll_id,
					option: option as string,
					is_correct: is_correct as boolean,
				};
			}
		);

		await db.insert(pollOptionsTable).values(pollOptions);

		console.log("🌱 Seeding complete!");
	} catch (error) {
		console.error("🌱 Error seeding database:", error);
	}
}

main();
