import { test, expect } from "@playwright/test"

test("services shows six offers with case-study proof", async ({ page }) => {
  await page.goto("/services")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bring a problem")
  const offers = page.getByRole("region", { name: "The six offers" })
  await expect(offers.getByRole("article")).toHaveCount(6)
  await expect(offers.getByRole("link", { name: "Vigil" }).first()).toHaveAttribute("href", "/work/vigil")
  await expect(offers.getByRole("link", { name: "ClearCut" }).first()).toHaveAttribute("href", "/work/clearcut")
})

test("services explains the engagement, process, honesty and FAQ", async ({ page }) => {
  await page.goto("/services")
  await expect(page.getByRole("region", { name: "Four ways to shape the work" })).toBeVisible()
  const process = page.getByRole("region", { name: "Discover, design, build, prove, hand over" })
  await expect(process.getByRole("listitem")).toHaveCount(5)
  await expect(page.getByRole("heading", { name: "An honest fit matters more than a sale." })).toBeVisible()
  await expect(page.locator("details")).toHaveCount(5)
})

test("the services CTA opens an email with a project prompt", async ({ page }) => {
  await page.goto("/services")
  const cta = page.getByRole("link", { name: "Email the brief" })
  const href = await cta.getAttribute("href")
  expect(href).toMatch(/^mailto:/)
  const decoded = decodeURIComponent(href ?? "")
  expect(decoded).toContain("What I am trying to build")
  expect(decoded).toContain("Existing codebase")
})

test("services does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/services")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
