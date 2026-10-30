import { test, expect } from "@playwright/test"

const probes = [
  { path: "/", url: "https://konethegreat.github.io/" },
  { path: "/work/vigil", url: "https://konethegreat.github.io/work/vigil" },
  { path: "/services", url: "https://konethegreat.github.io/services" },
]

for (const probe of probes) {
  test(`${probe.path} has matching canonical and social metadata`, async ({ page }) => {
    await page.goto(probe.path)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", probe.url)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", probe.url)
    await expect(page.locator('meta[property="og:title"]')).not.toHaveAttribute("content", "")
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute("content", "")
    await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute("content", probe.url)
  })
}

test("client navigation updates the canonical URL", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Control+k")
  await page.getByRole("combobox").fill("Services")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/services$/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://konethegreat.github.io/services",
  )
})
