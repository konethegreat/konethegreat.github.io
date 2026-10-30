import AxeBuilder from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

const routes = ["/", "/work", "/work/vigil", "/services", "/about", "/playground", "/contact", "/credits"]

for (const path of routes) {
  test(`${path} has no serious or critical accessibility findings`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    const blocking = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    )
    expect(blocking).toEqual([])
  })
}
