CREATE TABLE IF NOT EXISTS "usersSync" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text
);
--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_author_id_users_sync_id_fk";
--> statement-breakpoint
INSERT INTO "usersSync" ("id", "name", "email")
SELECT DISTINCT a.author_id, NULL, NULL
FROM articles a
WHERE NOT EXISTS (SELECT 1 FROM "usersSync" u WHERE u.id = a.author_id);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;