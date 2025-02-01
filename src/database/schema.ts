import { pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";

console.log("🌱 Loading schema...");
export const usersTable = pgTable("users", {
	id: serial("id").primaryKey(),
	display_name: varchar("display_name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	photo_url: text("photo_url"),
	roles: text("roles").notNull().default("[]"),
	total_polls_submitted: integer("total_polls_submitted").notNull().default(0),
});

export const pollsTable = pgTable("polls", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 256 }).notNull(),
	question: text("question").notNull(),
	status: varchar("status", { length: 256 }).notNull().default("open"),
	responses: text("responses").notNull().default("[]"),
});

export const pollOptionsTable = pgTable("polls_options", {
	id: serial("id").primaryKey(),
	poll_id: integer("poll_id").notNull(),
	option: text("option").notNull(),
	votes: integer("votes").notNull().default(0),
});

export const pollCategoriesTable = pgTable("polls_categories", {
	poll_id: integer("poll_id").notNull(),
	category: varchar("category", { length: 256 }).notNull(),
});

// Response Options: Implements a many-to-many relationship between responses and poll options.
export const pollResponseOptionsTable = pgTable("polls_response_options", {
	response_id: integer("response_id").notNull(),
	option_id: integer("option_id").notNull(),
});

// Responses: Each response is linked to one poll and one user.
export const pollResponsesTable = pgTable("polls_responses", {
	response_id: serial("response_id").primaryKey(),
	poll_id: integer("poll_id").notNull(),
	user_id: integer("user_id").notNull(),
});
