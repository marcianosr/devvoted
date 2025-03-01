import {
	pollsTable,
	pollOptionsTable,
	pollCategoriesTable,
	pollResponseOptionsTable,
	pollResponsesTable,
	usersTable,
	activeRunTable,
} from "@/database/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";

// Infer types from schema
export type User = {
	id: string;
	display_name: string;
	email: string;
	photo_url: string | null;
	roles: "user" | "admin";
	total_polls_submitted: number;
	active_config: string | null;
};

export type Poll = {
	id: number;
	question: string;
	status: string;
	answer_type: "single" | "multiple";
	created_by: string;
	updated_at: Date;
	created_at: Date;
	opening_time: Date;
	closing_time: Date;
	category_code: string;
};

export type PollOption = {
	id: number;
	poll_id: number;
	option: string;
	is_correct: boolean;
};

export type Status = {
	id?: number;
	code: string;
	name: string;
};

export type Category = {
	id?: number;
	code: string;
	name: string;
};

export type ActiveRun = {
	id: string;
	user_id: string;
	category_code: string;
	temporary_xp: number;
	current_streak: number;
	streak_multiplier: number;
	started_at: Date;
	last_poll_at: Date;
	locked_in_at: Date | null;
};

export type PollCategory = InferSelectModel<typeof pollCategoriesTable>;
export type PollResponse = InferSelectModel<typeof pollResponsesTable>;
export type PollResponseOption = InferSelectModel<
	typeof pollResponseOptionsTable
>;

// Types for joined queries
export type PollWithDetails = Poll & {
	polls_options: PollOption[];
	polls_categories: PollCategory[];
};

// Database helper types
export type InsertUser = InferInsertModel<typeof usersTable>;
export type InsertPoll = InferInsertModel<typeof pollsTable>;
export type InsertPollOption = InferInsertModel<typeof pollOptionsTable>;
export type InsertPollCategory = InferInsertModel<typeof pollCategoriesTable>;
