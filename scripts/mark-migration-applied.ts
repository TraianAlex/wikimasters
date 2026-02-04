/**
 * One-time script: mark the initial migration (0000_old_lila_cheney) as applied
 * when the `articles` table already exists and `npm run db:migrate` fails with
 * "relation \"articles\" already exists".
 *
 * Run: npx tsx scripts/mark-migration-applied.ts
 * Then run: npm run db:migrate
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const migrationTag = "0000_old_lila_cheney";
const migrationPath = join(process.cwd(), "drizzle", `${migrationTag}.sql`);
const sqlContent = readFileSync(migrationPath, "utf-8");
const hash = createHash("sha256").update(sqlContent).digest("hex");
const when = 1770163184587;

const sql = neon(DATABASE_URL);

async function main() {
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;
  const existing = await sql`
    SELECT 1 FROM drizzle.__drizzle_migrations WHERE hash = ${hash} LIMIT 1
  `;
  if (existing.length > 0) {
    console.log(`Migration ${migrationTag} is already marked as applied.`);
    return;
  }
  await sql`
    INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
    VALUES (${hash}, ${when})
  `;
  console.log(
    `Marked migration ${migrationTag} as applied. You can now run: npm run db:migrate`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
