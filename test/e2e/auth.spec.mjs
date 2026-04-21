import { expect, test } from "@playwright/test";

test.describe("Authentication Flow (Unauthenticated)", () => {
  test("should display sign in and sign up buttons when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    const signInButton = page.locator("text=Sign In");
    const signUpButton = page.locator("text=Sign Up");
    await expect(signInButton).toBeVisible();
    await expect(signUpButton).toBeVisible();
  });

  test("should not show New Article button when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    const newArticleButton = page.locator("text=New Article");
    await expect(newArticleButton).not.toBeVisible();
  });

  test("should navigate to Stack auth when clicking sign in", async ({
    page,
  }) => {
    await page.goto("/");
    const signInButton = page.locator("text=Sign In");
    await signInButton.click();
    await expect(page).toHaveURL(/.*handler.*sign-in.*/);
  });

  test("should navigate to Stack auth when clicking sign up", async ({
    page,
  }) => {
    await page.goto("/");
    const signUpButton = page.locator("text=Sign Up");
    await signUpButton.click();
    await expect(page).toHaveURL(/.*handler.*sign-up.*/);
  });

  test("should protect article creation route", async ({ page }) => {
    await page.goto("/wiki/edit/new");
    await page.waitForURL(/.*handler.*/, { timeout: 5000 });
    expect(page.url()).toMatch(/handler/);
  });

  test("should protect article edit routes", async ({ page }) => {
    await page.goto("/wiki/edit/1");
    await page.waitForURL(/.*handler.*/, { timeout: 5000 });
    expect(page.url()).toMatch(/handler/);
  });

  test("should allow viewing articles without authentication", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    const titleLink = page.getByRole("link", { name: "Wikimasters" });
    await expect(titleLink).toBeVisible();
    const signInButton = page.locator("text=Sign In");
    await expect(signInButton).toBeVisible();
  });

  test("should allow viewing individual articles without authentication", async ({
    page,
  }) => {
    await page.goto("/");
    const articleCard = page.locator('[data-testid="article-card"]').first();
    const hasArticles = await articleCard.isVisible().catch(() => false);
    if (hasArticles) {
      await articleCard.click();
      await expect(page).toHaveURL(/\/wiki\/\d+/);
      const newArticleButton = page.locator("text=New Article");
      await expect(newArticleButton).not.toBeVisible();
    }
  });
});
