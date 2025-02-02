ALTER TABLE "polls_categories" ALTER COLUMN "poll_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "polls_options" ALTER COLUMN "poll_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "polls_options" ALTER COLUMN "votes" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "polls_response_options" ALTER COLUMN "response_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "polls_response_options" ALTER COLUMN "option_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "polls_responses" ALTER COLUMN "poll_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "polls_responses" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "total_polls_submitted" SET DATA TYPE integer;