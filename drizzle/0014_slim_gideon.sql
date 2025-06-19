ALTER TABLE "polls_active_runs" ADD COLUMN "status" "status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "polls_user_performance" DROP COLUMN "devvoted_score";