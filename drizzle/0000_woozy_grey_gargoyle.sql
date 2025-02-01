CREATE TABLE "polls_categories" (
	"poll_id" serial NOT NULL,
	"category" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"poll_id" serial NOT NULL,
	"option" text NOT NULL,
	"votes" serial DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls_response_options" (
	"response_id" serial NOT NULL,
	"option_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls_responses" (
	"response_id" serial PRIMARY KEY NOT NULL,
	"poll_id" serial NOT NULL,
	"user_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"question" text NOT NULL,
	"status" varchar(256) DEFAULT 'open' NOT NULL,
	"responses" text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"photo_url" text,
	"roles" text DEFAULT '[]' NOT NULL,
	"total_polls_submitted" serial DEFAULT 0 NOT NULL
);
