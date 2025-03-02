CREATE TABLE "polls_user_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"category_code" varchar(50) NOT NULL,
	"permanent_xp" integer DEFAULT 0 NOT NULL,
	"best_streak" integer DEFAULT 0 NOT NULL,
	"best_multiplier" numeric(3, 1) DEFAULT '0.0' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "polls_active_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"category_code" varchar(50) NOT NULL,
	"temporary_xp" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"streak_multiplier" numeric(3, 1) DEFAULT '0.0' NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"last_poll_at" timestamp DEFAULT now(),
	"locked_in_at" timestamp
);
--> statement-breakpoint
DROP TABLE "poll_active_runs" CASCADE;--> statement-breakpoint
DROP TABLE "poll_user_performance" CASCADE;--> statement-breakpoint
ALTER TABLE "polls_user_performance" ADD CONSTRAINT "polls_user_performance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_user_performance" ADD CONSTRAINT "polls_user_performance_category_code_polls_categories_code_fk" FOREIGN KEY ("category_code") REFERENCES "public"."polls_categories"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_active_runs" ADD CONSTRAINT "polls_active_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_active_runs" ADD CONSTRAINT "polls_active_runs_category_code_polls_categories_code_fk" FOREIGN KEY ("category_code") REFERENCES "public"."polls_categories"("code") ON DELETE no action ON UPDATE no action;