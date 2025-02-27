import {
	pgTable,
	serial,
	text,
	varchar,
	integer,
	pgEnum,
	timestamp,
	boolean,
	uuid,
} from "drizzle-orm/pg-core";

console.log("🌱 Loading schema...");

export const userRoles = pgEnum("roles", ["user", "admin"] as const);
export const status = pgEnum("status", [
	"draft", // Not yet published.
	"pending-review", // Waiting for approval before opening.
	"needs-revision", // Reviewed but requires changes.
	"open", // Accepting responses.
	"closed", // No longer accepting responses.
] as const);

export type User = {
	id: string;
	display_name: string;
	email: string;
	photo_url: string | null;
	roles: "user" | "admin";
	total_polls_submitted: number;
};

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey(),
	display_name: varchar("display_name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	photo_url: text("photo_url"),
	roles: userRoles("roles").notNull().default("user"),
	total_polls_submitted: integer("total_polls_submitted")
		.notNull()
		.default(0),
	active_config: varchar("active_config", { length: 50 }).default("vanilla-config"),
});

export const pollsTable = pgTable("polls", {
	id: serial("id").primaryKey(),
	question: text("question").notNull(),
	status: status("status").notNull().default("draft"),
	opening_time: timestamp("opening_time").notNull(),
	closing_time: timestamp("closing_time").notNull(),
	created_by: uuid("created_by")
		.references(() => usersTable.id)
		.notNull(),
	created_at: timestamp("created_at").notNull(),
	updated_at: timestamp("updated_at").notNull(),
});

export const pollOptionsTable = pgTable("polls_options", {
	id: serial("id").primaryKey(),
	poll_id: integer("poll_id")
		.references(() => pollsTable.id)
		.notNull(),
	option: text("option").notNull(),
	is_correct: boolean("is_correct").notNull().default(false),
});

export const pollCategoriesTable = pgTable("polls_categories", {
	poll_id: integer("poll_id").notNull(),
	category: varchar("category", { length: 256 }).notNull(),
});

// Response Options: Implements a many-to-many relationship between responses and poll options.
export const pollResponseOptionsTable = pgTable("polls_response_options", {
	response_id: integer("response_id")
		.references(() => pollResponsesTable.response_id)
		.notNull(),
	option_id: integer("option_id")
		.references(() => pollOptionsTable.id)
		.notNull(),
});

// Responses: Each response is linked to one poll and one user.
export const pollResponsesTable = pgTable("polls_responses", {
	response_id: serial("response_id").primaryKey(),
	poll_id: integer("poll_id")
		.references(() => pollsTable.id)
		.notNull(),
	user_id: uuid("user_id").notNull(), // Changed to uuid for UUID
});
