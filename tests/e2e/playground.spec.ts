import { test, expect } from "@playwright/test"

test("the effects switch explains itself and turns autoplay off", async ({ page }) => {
  await page.goto("/playground")
  const toggle = page.getByRole("switch", { name: "Ambient effects" })
  await expect(toggle).toHaveAttribute("aria-checked", "true")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-checked", "false")
  expect(await page.evaluate(() => localStorage.getItem("kt-effects"))).toBe("off")
  await expect(page.getByText(/wait for you to press play/)).toBeVisible()
})

test("the UI Vault shelf shows live work, credits and the full vault link", async ({ page }) => {
  await page.goto("/playground")
  const shelf = page.getByRole("region", { name: "From the vault, running here." })
  await expect(shelf.getByRole("article")).toHaveCount(3)
  await expect(shelf.getByRole("link", { name: "Kedhareswer Naidu, MIT" }).first()).toHaveAttribute(
    "href",
    "https://21st.dev/@kedhareswer/components/glass-folder-cards",
  )
  await expect(shelf.getByRole("link", { name: "Open the full vault" })).toHaveAttribute(
    "href",
    "https://konethegreat.github.io/ui-vault/",
  )
})

test("the lab tabs still switch panels", async ({ page }) => {
  await page.goto("/playground")
  await page.getByRole("tab", { name: "Agent loop" }).click()
  await expect(page.getByRole("tab", { name: "Agent loop" })).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel")).toBeVisible()
})

test("playground does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/playground")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
