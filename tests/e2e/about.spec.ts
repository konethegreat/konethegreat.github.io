import { test, expect } from "@playwright/test"

test("about shows the portrait, story and dated evidence", async ({ page }) => {
  await page.goto("/about")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Kone Tshivhinda")
  await expect(page.locator("main img").first()).toBeVisible()
  const chapters = page.getByRole("list", { name: "Story chapters" })
  await expect(chapters.getByRole("listitem")).toHaveCount(7)
  await expect(chapters.getByRole("link", { name: "Vigil" })).toHaveAttribute("href", "/work/vigil")
  await expect(chapters.getByRole("link", { name: "UI Vault" })).toHaveAttribute("href", "/work/ui-vault")
})

test("about principles and stack link to real case studies", async ({ page }) => {
  await page.goto("/about")
  const principles = page.getByRole("region", { name: "Four rules the work has to pass." })
  await expect(principles.getByRole("link", { name: "Vigil" }).first()).toHaveAttribute("href", "/work/vigil")
  const stack = page.getByRole("region", { name: "Tools, grouped by the job." })
  await expect(stack.getByRole("link", { name: "ClearCut" }).first()).toHaveAttribute("href", "/work/clearcut")
})

test("a gallery photo opens in a dialog and returns focus", async ({ page }) => {
  await page.goto("/about")
  const opener = page.getByRole("button", { name: "Open photo: Graduation day." })
  await opener.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(opener).toBeFocused()
})

test("about does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/about")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
