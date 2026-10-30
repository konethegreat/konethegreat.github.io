import { test, expect } from "@playwright/test"

test("a case study renders its evidence and next project", async ({ page }) => {
  await page.goto("/work/vigil")
  await expect(page.getByRole("heading", { level: 1, name: "Vigil" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Decisions that matter" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Proof" })).toBeVisible()
  await expect(page.getByRole("link", { name: /ClearCut/ }).last()).toBeVisible()
})

test("a case study with a live deployment links to it", async ({ page }) => {
  await page.goto("/work/clearcut")
  await expect(page.getByRole("link", { name: "Open live site" })).toHaveAttribute(
    "href",
    "https://145-241-100-85.sslip.io/",
  )
})

test("a live case study shows a dated screenshot and a phone view", async ({ page }) => {
  await page.goto("/work/sa-jas")
  await expect(page.getByRole("img", { name: /home page at desktop width/ })).toBeVisible()
  await expect(page.getByText(/Screenshot of the live site, captured 30 October 2026/)).toBeVisible()
  await expect(page.getByRole("heading", { name: "Gallery" })).toBeVisible()
  await expect(page.getByRole("img", { name: /SA-JAS at phone width/ })).toBeVisible()
})

test("Vigil keeps its labelled illustrated cover", async ({ page }) => {
  await page.goto("/work/vigil")
  await expect(page.getByRole("img", { name: /Illustrated cover, not a screenshot/ })).toBeVisible()
})
