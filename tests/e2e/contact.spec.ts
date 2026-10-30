import { test, expect } from "@playwright/test"

test("contact copies the assembled email address", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/contact")
  await page.getByRole("button", { name: "Copy email address" }).click()
  await expect(page.getByRole("status")).toContainText("copied")
  const value = await page.evaluate(() => navigator.clipboard.readText())
  expect(value).toBe("erictshivhinda@gmail.com")
})

test("contact offers a mailto link and the project prompt", async ({ page }) => {
  await page.goto("/contact")
  const mail = page.getByRole("link", { name: "Open in your mail app" })
  const href = await mail.getAttribute("href")
  expect(href).toMatch(/^mailto:/)
  const decoded = decodeURIComponent(href ?? "")
  expect(decoded).toContain("What I am trying to build")
  expect(decoded).toContain("The deadline")
})

test("contact never renders a form", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.locator("form")).toHaveCount(0)
  await expect(page.getByText("No contact form")).toBeVisible()
})

test("contact does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/contact")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
