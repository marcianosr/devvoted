ALTER TABLE "polls_user_performance" ADD COLUMN "devvoted_score" numeric(10, 2) DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "polls_user_performance" DROP COLUMN "permanent_xp";--> statement-breakpoint
ALTER TABLE "polls_active_runs" DROP COLUMN "locked_in_at";