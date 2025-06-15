import {
	pollCategoriesTable,
	pollOptionsTable,
	pollsTable,
	usersTable,
} from "@/database/schema";
import { db } from "@/database/db";
import { Poll, PollOption, PollCategory, User } from "@/types/db";

const DEV_UID = "f40d940b-9d3b-47f3-a73a-4dfba18b20c2";

// Define user with all required fields from the schema
const user: User = {
	id: DEV_UID,
	display_name: "Devvoted",
	email: "devvoted@devvoted.com",
	photo_url: null,
	role: "admin" as const,
	total_polls_submitted: 0,
	active_config: null,
} as const;

const categories: Omit<PollCategory, "id">[] = [
	{ code: "css", name: "CSS" },
	{ code: "js", name: "JavaScript" },
	{ code: "react", name: "React" },
	{ code: "general-frontend", name: "General Frontend" },
	{ code: "typescript", name: "TypeScript" },
	{ code: "general-backend", name: "General Backend" },
	{ code: "git", name: "Git" },
	{ code: "html", name: "HTML" },
];

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
		answer_type: "single",
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
		answer_type: "multiple",
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
		answer_type: "multiple",
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
		answer_type: "single",
	},
	{
		question:
			"In TS, the type system is very strict, what do you know about it, can you share?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "typescript",
		answer_type: "multiple",
	},
	{
		question:
			"For CSS devs this might be a no-brainer, but what flex property makes sure items are forced on multiple lines when they don’t fit their container?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "multiple",
	},
	{
		question:
			"In CSS, for readability it’s important to have vertical spacing for text inbetween, what property do you use that make your text look neat and clean?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "multiple",
	},
	{
		question:
			"In CSS, the position property was implemented long ago, which values from below remove the elements out of the document flow?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "single",
	},
	{
		question: "What is the best way to center a flex item vertically?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "single",
	},
	{
		question:
			"In CSS, the z-index property is used to control the stack order of elements, what is the default value?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "single",
	},
	{
		question:
			"In CSS, margin is a property that can be used to create space between an element and its container, what are the possible values?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "single",
	},
	{
		question:
			"In CSS, what is the best way to center a flex item horizontally?",
		status: "open",
		created_by: user.id,
		updated_at: new Date(),
		created_at: new Date(),
		opening_time: new Date(),
		closing_time: new Date(),
		category_code: "css",
		answer_type: "single",
	},
];

const pollOptionsData = [
	["Option 1", false],
	["Option 2", false],
	["Option 3", false],
	["Option 1", true],
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
	["Option 6", false],
	["Option 7", false],
	["Option 8", false],
	["Option 9", false],
	["Option 10", true],
	["Option 11", false],
	["Option 12", false],
	["Option 13", false],
	["Option 14", true],
	["Option 15", false],
	["Option 16", false],
	["Option 17", false],
	["Option 18", false],
	["Option 19", false],
	["Option 20", true],
	["Option 21", false],
	["Option 22", false],
	["Option 23", false],
	["Option 24", true],
	["Option 25", false],
	["Option 26", false],
	["Option 27", false],
	["Option 28", false],
	["Option 29", false],
	["Option 30", true],
	["Option 31", false],
	["Option 32", false],
	["Option 33", false],
	["Option 34", true],
	["Option 35", false],
	["Option 36", false],
	["Option 37", false],
	["Option 38", false],
	["Option 39", false],
	["Option 40", true],
	["Option 41", false],
	["Option 42", false],
	["Option 43", false],
	["Option 44", true],
	["Option 45", false],
	["Option 46", false],
	["Option 47", false],
	["Option 48", false],
	["Option 49", false],
	["Option 50", true],
];

async function main() {
	console.log("🌱 Starting to seed database...");

	try {
		console.log("🌱 Creating development user...");

		await db
			.insert(usersTable)
			.values(user)
			.returning({ id: usersTable.id });

		console.log("🌱 Creating categories...");
		await db.insert(pollCategoriesTable).values(categories);

		console.log("🌱 Creating polls...");

		const insertedPolls = await db
			.insert(pollsTable)
			.values(polls)
			.returning({ id: pollsTable.id });

		console.log("🌱 Creating poll options...");

		const pollOptions: Omit<PollOption, "id">[] = pollOptionsData
			.map(([option, is_correct], index) => {
				// Calculate which poll this option belongs to
				// We have 10 options per poll (2 polls with 5 options each originally, now more polls)
				const pollIndex = Math.floor(index / 5);

				// Make sure we don't exceed the number of polls we have
				if (pollIndex >= insertedPolls.length) {
					console.log(
						`Skipping option ${option} as we don't have enough polls`
					);
					return null;
				}

				const poll_id = insertedPolls[pollIndex].id;
				return {
					poll_id,
					option: option as string,
					is_correct: is_correct as boolean,
				};
			})
			.filter(Boolean) as Omit<PollOption, "id">[]; // Filter out any null values

		await db.insert(pollOptionsTable).values(pollOptions);

		console.log("🌱 Seeding complete!");

		process.exit(0);
	} catch (error) {
		console.error("🌱 Error seeding database:", error);
	}
}

main();
