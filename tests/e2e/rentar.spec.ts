import { test, expect } from "@playwright/test";

test.describe("Rentar E2E", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Never miss rent again")).toBeVisible();
    await expect(page.getByText("Rentar")).toBeVisible();
  });

  test("auth page shows wallet options", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByText("Connect Wallet")).toBeVisible();
    await expect(page.getByText("Freighter Wallet")).toBeVisible();
    await expect(page.getByText("WalletConnect")).toBeVisible();
  });

  test("dashboard redirects to auth when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*auth/);
  });

  test("responsive landing", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await expect(page.getByText("Never miss rent again")).toBeVisible();
  });

  test("dark mode toggle exists", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByLabel("Toggle theme");
    await expect(toggle).toBeVisible();
  });
});

test.describe("Rentar API Mock", () => {
  test("health check", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
  });

  test("auth challenge", async ({ request }) => {
    const res = await request.post("/api/auth/challenge", { data: { publicKey: "GTEST123" } });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.challenge).toBeDefined();
  });

  test("savings overview", async ({ request }) => {
    const res = await request.get("/api/savings/overview");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.totalSaved).toBeDefined();
  });
});
