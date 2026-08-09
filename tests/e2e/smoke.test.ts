// Copyright (c) 2026 Falko Schumann. All rights reserved. MIT license.

import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:4173");

  await expect(page).toHaveTitle(/todos/);
  await expect(page.getByRole("heading", { name: "todos" })).toBeVisible();
});

test.skip("get started link", async ({ page }) => {
  await page.goto("http://localhost:4173");

  await page.getByRole("link", { name: "Get started" }).click();

  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});
