import {
	pollsTable,
	pollOptionsTable,
	pollCategoriesTable,
	pollResponseOptionsTable,
	pollResponsesTable,
	usersTable,
} from "@/database/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";

// Infer types from schema
export type User = InferSelectModel<typeof usersTable>;
export type Poll = InferSelectModel<typeof pollsTable>;
export type PollOption = InferSelectModel<typeof pollOptionsTable>;
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
