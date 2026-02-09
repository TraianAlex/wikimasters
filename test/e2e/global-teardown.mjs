import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

async function globalTeardown() {
  const serverPidPath = join(process.cwd(), ".test-server-pid.json");
  if (existsSync(serverPidPath)) {
    try {
      const { pid } = JSON.parse(readFileSync(serverPidPath, "utf-8"));
      console.log(`Stopping dev server (PID: ${pid})...`);
      process.kill(pid, "SIGTERM");
      unlinkSync(serverPidPath);
    } catch (error) {
      console.error("Failed to stop dev server:", error);
    }
  }
}

export default globalTeardown;
