import AxeBuilder from "@axe-core/playwright"
import { test, expect, type Page } from "@playwright/test"

const routes = ["/", "/work", "/work/vigil", "/services", "/about", "/playground", "/contact", "/credits"]
const themes = ["light", "dark"] as const

test.beforeEach(async ({ page }) => {
  // Sample the static composition: entrance animations can otherwise leave text
  // mid-fade when axe reads the computed colours.
  await page.emulateMedia({ reducedMotion: "reduce" })
})

async function blockingFindings(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  return results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  )
}

async function openInTheme(page: Page, path: string, theme: (typeof themes)[number]) {
  await page.addInitScript((value) => localStorage.setItem("kone-theme", value), theme)
  await page.goto(path)
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
}

for (const theme of themes) {
  for (const path of routes) {
    test(`${path} ${theme} has no serious or critical accessibility findings`, async ({ page }) => {
      await openInTheme(page, path, theme)
      expect(await blockingFindings(page)).toEqual([])
    })
  }

  test(`the radial menu ${theme} has no serious or critical accessibility findings`, async ({ page }) => {
    await openInTheme(page, "/", theme)
    await page.getByRole("button", { name: "Open menu" }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    expect(await blockingFindings(page)).toEqual([])
  })

  test(`the command menu ${theme} has no serious or critical accessibility findings`, async ({ page }) => {
    await openInTheme(page, "/", theme)
    await page.keyboard.press("Control+k")
    await expect(page.getByRole("dialog")).toBeVisible()
    expect(await blockingFindings(page)).toEqual([])
  })
}
