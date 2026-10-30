import { test, expect } from "@playwright/test"

test("work filters case studies by station", async ({ page }) => {
  await page.goto("/work")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Eight builds")
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(8)
  await page.getByRole("button", { name: "Agents" }).click()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(3)
  await page.getByRole("button", { name: "All work" }).click()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(8)
})

test("a work card opens the case study", async ({ page }) => {
  await page.goto("/work")
  await page.getByRole("link", { name: "Read the case study" }).first().click()
  await expect(page).toHaveURL(/\/work\/vigil$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Vigil")
})
