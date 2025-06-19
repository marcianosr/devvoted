CREATE TYPE "public"."run_status" AS ENUM('finished', 'active');--> statement-breakpoint
ALTER TABLE "polls_active_runs" ADD COLUMN "run_status" "run_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "polls_active_runs" DROP COLUMN "status";