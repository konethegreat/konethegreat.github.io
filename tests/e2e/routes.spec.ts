import { test, expect } from "@playwright/test"

const routes = [
  "/",
  "/work",
  "/work/vigil",
  "/work/clearcut",
  "/work/timelex",
  "/work/sa-jas",
  "/work/munisolve",
  "/work/reservoir",
  "/work/ui-vault",
  "/work/k-one",
  "/services",
  "/about",
  "/playground",
  "/contact",
  "/credits",
]

for (const path of routes) {
  test(`renders ${path} with one heading`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator("h1")).toBeVisible()
  })
}

test("unknown paths render the 404 page", async ({ page }) => {
  await page.goto("/this-does-not-exist")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not here")
})
