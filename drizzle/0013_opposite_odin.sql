CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"effect_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "challenges_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "user_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_id" integer NOT NULL,
	"polls_since_last_challenge" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;