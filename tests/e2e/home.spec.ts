import { test, expect } from "@playwright/test"

test("home shows the hero, seven live links and three folders", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Kone")
  await expect(page.locator("#live ul:not([aria-hidden]) a")).toHaveCount(7)
  await expect(page.getByRole("button", { name: /^Open (Client work|Studio|Play),/ })).toHaveCount(3)
})

test("the radial menu opens on the first item and Enter reaches Work", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Open menu" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("link", { name: "Home", exact: true })).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(page.getByRole("link", { name: "Work", exact: true })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/work$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Eight builds")
})

test("Ctrl K searches case studies", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Control+k")
  const input = page.getByRole("combobox")
  await expect(input).toBeFocused()
  await input.fill("Vigil")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/work\/vigil$/)
})

test("a folder file opens its case study and the back button returns home", async ({ page }) => {
  await page.goto("/")
  const folder = page.locator(".gf-root").filter({ hasText: "Client work" })
  await folder.getByRole("button", { name: /^Open Client work/ }).click()
  await folder.getByRole("link", { name: /SA-JAS/ }).locator(".gf-sheet-name").click()
  await expect(page).toHaveURL(/\/work\/sa-jas$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Kone")
})

test("home does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
