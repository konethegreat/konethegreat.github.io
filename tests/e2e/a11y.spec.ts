import AxeBuilder from "@axe-core/playwright"
import { test, expect, type Page } from "@playwright/test"

const routes = ["/", "/work", "/work/vigil", "/services", "/about", "/playground", "/contact", "/credits"]

async function blockingFindings(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  return results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  )
}

for (const path of routes) {
  test(`${path} has no serious or critical accessibility findings`, async ({ page }) => {
    await page.goto(path)
    expect(await blockingFindings(page)).toEqual([])
  })
}

test("the radial menu has no serious or critical accessibility findings", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Open menu" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  expect(await blockingFindings(page)).toEqual([])
})

test("the command menu has no serious or critical accessibility findings", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Control+k")
  await expect(page.getByRole("dialog")).toBeVisible()
  expect(await blockingFindings(page)).toEqual([])
})
