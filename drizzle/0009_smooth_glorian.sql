ALTER TABLE "polls_active_runs" ALTER COLUMN "current_streak" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "polls_user_performance" ADD COLUMN "betting_average" numeric(4, 1) DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");