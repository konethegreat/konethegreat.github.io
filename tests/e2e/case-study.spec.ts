import { test, expect } from "@playwright/test"

test("a case study renders its evidence and next project", async ({ page }) => {
  await page.goto("/work/vigil")
  await expect(page.getByRole("heading", { level: 1, name: "Vigil" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Decisions that matter" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Proof" })).toBeVisible()
  await expect(page.getByRole("link", { name: /ClearCut/ }).last()).toBeVisible()
})

test("a case study with a live deployment links to it", async ({ page }) => {
  await page.goto("/work/clearcut")
  await expect(page.getByRole("link", { name: "Open live site" })).toHaveAttribute(
    "href",
    "https://145-241-100-85.sslip.io/",
  )
})
