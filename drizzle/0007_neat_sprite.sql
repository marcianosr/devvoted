ALTER TABLE "users" ADD COLUMN "run_attempts" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "polls_active_runs" DROP COLUMN "attempts";