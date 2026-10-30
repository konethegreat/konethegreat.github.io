import { test, expect } from "@playwright/test"

test("credits names authors, sources, licenses and what changed", async ({ page }) => {
  await page.goto("/credits")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Credits")
  const components = page.getByRole("region", { name: "Components and inspiration" })
  await expect(components.getByRole("article")).toHaveCount(4)
  await expect(components.getByText("Kedhareswer Naidu").first()).toBeVisible()
  await expect(components.getByRole("link", { name: "MIT license" }).first()).toHaveAttribute(
    "href",
    "/licenses/mit.txt",
  )
  await expect(components.getByText(/No source copied/).first()).toBeVisible()
})

test("credits links every library and typeface to its source", async ({ page }) => {
  await page.goto("/credits")
  const libraries = page.getByRole("region", { name: "Libraries" })
  await expect(libraries.getByRole("article")).toHaveCount(7)
  await expect(libraries.getByRole("link", { name: "React" })).toHaveAttribute("href", "https://react.dev")
  const typefaces = page.getByRole("region", { name: "Typefaces" })
  await expect(typefaces.getByRole("article")).toHaveCount(4)
  await expect(typefaces.getByRole("link", { name: "OFL license" }).first()).toHaveAttribute(
    "href",
    "/licenses/ofl-1.1.txt",
  )
})

test("credits does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/credits")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
