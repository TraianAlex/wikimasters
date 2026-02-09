const path = require("node:path");
const { defineConfig, devices } = require("@playwright/test");
const dotenv = require("dotenv");

// Load environment variables from .env.test
dotenv.config({ quiet: true, path: path.join(__dirname, ".env.test") });
// Load .env.test.local if it exists (created by global setup)
dotenv.config({ quiet: true, path: path.join(__dirname, ".env.test.local") });

module.exports = defineConfig({
  testDir: "./test/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "html",
  globalSetup: path.join(__dirname, "./test/e2e/global-setup.mjs"),
  globalTeardown: path.join(__dirname, "./test/e2e/global-teardown.mjs"),
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Setup project to handle authentication
    {
      name: "setup",
      testMatch: /.*\.setup\.mjs$/,
    },
    // Authenticated tests
    {
      name: "chromium-authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "playwright/.auth/user.json"),
      },
      dependencies: ["setup"],
      testIgnore: /auth\.spec\.(ts|mjs)$/,
    },
    // Unauthenticated tests (for testing auth flows)
    {
      name: "chromium-unauthenticated",
      use: {
        ...devices["Desktop Chrome"],
      },
      testMatch: /auth\.spec\.mjs$/,
    },
  ],
});
