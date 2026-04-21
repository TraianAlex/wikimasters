import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test as setup } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authDir = path.join(__dirname, "../../playwright/.auth");
const authFile = path.join(authDir, "user.json");

const EMPTY_STORAGE_STATE = { cookies: [], origins: [] };

setup("authenticate", async ({ page }) => {
  const stackProjectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
  const stackPublishableKey =
    process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

  if (!stackProjectId || !stackPublishableKey) {
    throw new Error(
      "Stack credentials not found. Please set NEXT_PUBLIC_STACK_PROJECT_ID and NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY in your .env.test.local file",
    );
  }

  await page.goto("/handler/sign-in");
  await page.waitForLoadState("networkidle");

  const testEmail = process.env.TEST_USER_EMAIL;
  const testPassword = process.env.TEST_USER_PASSWORD;

  if (!testEmail || !testPassword) {
    console.warn("⚠️  TEST_USER_EMAIL and TEST_USER_PASSWORD not set.");
    console.warn("⚠️  Skipping authentication setup...");
    mkdirSync(authDir, { recursive: true });
    writeFileSync(authFile, JSON.stringify(EMPTY_STORAGE_STATE, null, 2));
    return;
  }

  try {
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    await emailInput.waitFor({ timeout: 5000 });
    await emailInput.fill(testEmail);

    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();
    await passwordInput.fill(testPassword);

    const signInButton = page.locator('button[type="submit"]').first();
    await signInButton.click();

    const loggedInIndicator = page
      .locator("text=New Article")
      .or(page.locator('[data-testid="user-menu"]'));
    await loggedInIndicator.waitFor({ state: "visible", timeout: 20000 });

    console.log("✅ Authentication successful");

    mkdirSync(authDir, { recursive: true });
    await page.context().storageState({ path: authFile });
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    await page.screenshot({ path: "playwright/.auth/auth-error.png" });
    throw new Error(
      "Failed to authenticate. Please check:\n" +
        "1. TEST_USER_EMAIL and TEST_USER_PASSWORD are correct\n" +
        "2. The test user exists in your Stack project\n" +
        "3. Stack selectors match the actual UI (check auth-error.png screenshot)\n" +
        `Error: ${error}`,
    );
  }
});
