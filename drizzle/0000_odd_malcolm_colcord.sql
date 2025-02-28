CREATE TYPE "public"."status" AS ENUM('draft', 'needs-revision', 'open', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"code" varchar(256) NOT NULL,
	CONSTRAINT "categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "polls_categories" (
	"poll_id" integer NOT NULL,
	"category" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"poll_id" integer NOT NULL,
	"option" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls_response_options" (
	"response_id" integer NOT NULL,
	"option_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls_responses" (
	"response_id" serial PRIMARY KEY NOT NULL,
	"poll_id" integer NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"opening_time" timestamp NOT NULL,
	"closing_time" timestamp NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"category_code" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"photo_url" text,
	"roles" "roles" DEFAULT 'user' NOT NULL,
	"total_polls_submitted" integer DEFAULT 0 NOT NULL,
	"active_config" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "polls_options" ADD CONSTRAINT "polls_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_response_options" ADD CONSTRAINT "polls_response_options_response_id_polls_responses_response_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."polls_responses"("response_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_response_options" ADD CONSTRAINT "polls_response_options_option_id_polls_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."polls_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_responses" ADD CONSTRAINT "polls_responses_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_category_code_categories_code_fk" FOREIGN KEY ("category_code") REFERENCES "public"."categories"("code") ON DELETE no action ON UPDATE no action;