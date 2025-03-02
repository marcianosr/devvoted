import {
	pollsTable,
	pollOptionsTable,
	pollCategoriesTable,
	pollResponseOptionsTable,
	pollResponsesTable,
	usersTable,
	pollsActiveRunTable,
} from "@/database/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";

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
export type Poll = InferSelectModel<typeof pollsTable>;
export type PollOption = InferSelectModel<typeof pollOptionsTable>;

export type ActiveRun = InferSelectModel<typeof pollsActiveRunTable>;
export type User = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;
export type InsertPoll = InferInsertModel<typeof pollsTable>;
export type InsertPollOption = InferInsertModel<typeof pollOptionsTable>;
export type InsertPollCategory = InferInsertModel<typeof pollCategoriesTable>;

export type InsertActiveRun = InferInsertModel<typeof pollsActiveRunTable>;
export type UpdateActiveRun = InferInsertModel<typeof pollsActiveRunTable>;
