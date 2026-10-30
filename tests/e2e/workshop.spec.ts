import { test, expect } from "@playwright/test"

test("the workshop exposes six stations and filters on click", async ({ page }) => {
  await page.goto("/work")
  const workshop = page.getByRole("region", { name: "The workshop" })
  await expect(workshop).toBeVisible()
  await expect(workshop.getByRole("button")).toHaveCount(7)
  await workshop.getByRole("button", { name: "Local-first" }).click()
  await expect(workshop.getByRole("button", { name: "Local-first" })).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(3)
})

test("clicking the active station clears the filter", async ({ page }) => {
  await page.goto("/work")
  const workshop = page.getByRole("region", { name: "The workshop" })
  await workshop.getByRole("button", { name: "Agents" }).click()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(3)
  await workshop.getByRole("button", { name: "Agents" }).click()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(8)
})
