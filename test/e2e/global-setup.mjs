import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

let devServer = null;

async function waitForServer(url, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        return;
      }
    } catch (_error) {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

async function globalSetup() {
  console.log("Building Next.js app...");
  await new Promise((resolve, reject) => {
    const build = spawn("npm", ["run", "build"], {
      env: { ...process.env, PLAYWRIGHT: "1" },
      stdio: "inherit",
      shell: true,
    });
    build.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`npm run build failed with code ${code}`));
    });
  });

  console.log("Starting production server...");
  devServer = spawn("npm", ["run", "start"], {
    env: { ...process.env, PLAYWRIGHT: "1" },
    stdio: "inherit",
    shell: true,
  });

  await waitForServer("http://localhost:3000", 120000);
  console.log("✅ Dev server is ready");

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL || "");
    console.log(
      "🔁 Syncing articles sequence to MAX(id) to avoid PK collisions...",
    );
    await sql.query(
      `SELECT setval(pg_get_serial_sequence('articles','id'), COALESCE((SELECT MAX(id) FROM articles), 1), true);`,
    );
    console.log("✅ Sequence sync complete");
  } catch (err) {
    console.warn("⚠️ Failed to sync articles sequence:", err);
  }

  writeFileSync(
    join(process.cwd(), ".test-server-pid.json"),
    JSON.stringify({ pid: devServer.pid }, null, 2),
  );
}

export default globalSetup;
