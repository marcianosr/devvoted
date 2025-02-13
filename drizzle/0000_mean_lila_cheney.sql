CREATE TYPE "public"."status" AS ENUM('draft', 'pending-review', 'needs-revision', 'open', 'closed');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('user', 'admin');--> statement-breakpoint
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
	"user_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"opening_time" timestamp NOT NULL,
	"closing_time" timestamp NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"photo_url" text,
	"roles" "roles" DEFAULT 'user' NOT NULL,
	"total_polls_submitted" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "polls_options" ADD CONSTRAINT "polls_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_response_options" ADD CONSTRAINT "polls_response_options_response_id_polls_responses_response_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."polls_responses"("response_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_response_options" ADD CONSTRAINT "polls_response_options_option_id_polls_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."polls_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_responses" ADD CONSTRAINT "polls_responses_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;