import { expect, test } from "@playwright/test";

test("lye calculator computes lye and water for the default two-oil recipe", async ({
  page,
}) => {
  await page.goto("/lye-calculator");
  // Defaults: Olive Oil 500g (SAP 0.134) + Coconut Oil 300g (SAP 0.19),
  // 5% superfat, NaOH, 38% water, 100% purity.
  await expect(page.getByTestId("result")).toContainText("Total oils: 800 g");
  const expectedLye = (500 * 0.134 + 300 * 0.19) * 0.95;
  await expect(page.getByTestId("result")).toContainText(
    `NaOH: ${Math.round(expectedLye * 10) / 10} g`
  );
  await expect(page.getByTestId("result")).toContainText("Water: 304 g");
});

test("lye calculator recomputes when an oil weight changes", async ({ page }) => {
  await page.goto("/lye-calculator");
  await page.getByLabel("Oil 1 weight in grams").fill("1000");
  await expect(page.getByTestId("result")).toContainText("Total oils: 1300 g");
});

test("lye calculator switches to KOH and gets a larger lye figure", async ({
  page,
}) => {
  await page.goto("/lye-calculator");
  await page.getByLabel("Lye type").selectOption("KOH");
  await expect(page.getByTestId("result")).toContainText("KOH:");
});

test("lye calculator can add and remove an oil row", async ({ page }) => {
  await page.goto("/lye-calculator");
  await page.getByRole("button", { name: "+ Add another oil" }).click();
  await expect(page.getByLabel("Oil 3 type")).toBeVisible();
  await page.getByLabel("Remove oil 3").click();
  await expect(page.getByLabel("Oil 3 type")).toHaveCount(0);
});

test("lye calculator rejects an out-of-range superfat", async ({ page }) => {
  await page.goto("/lye-calculator");
  await page.getByLabel("Superfat percent").fill("50");
  await expect(page.getByTestId("result").getByRole("alert")).toContainText(
    "Superfat"
  );
});

test("lye calculator increases the lye figure when purity drops below 100%", async ({
  page,
}) => {
  await page.goto("/lye-calculator");
  const resultText = await page.getByTestId("result").innerText();
  await page.getByLabel("Lye purity percent").fill("90");
  await expect(page.getByTestId("result")).not.toContainText(resultText);
  await expect(page.getByTestId("result")).toContainText("at 90% purity");
});

test("lye calculator rejects a recipe whose water is too low to safely dissolve the lye", async ({
  page,
}) => {
  await page.goto("/lye-calculator");
  await page.getByLabel("Water percent of oil weight").fill("10");
  await expect(page.getByTestId("result").getByRole("alert")).toContainText(
    "lye concentration"
  );
});

test("water:lye ratio converter keeps ratio and concentration in sync", async ({
  page,
}) => {
  await page.goto("/water-lye-ratio");
  await page.getByLabel("Water to lye ratio").fill("1");
  await expect(page.getByLabel("Lye concentration percent")).toHaveValue("50");
});

test("water:lye ratio converter does not accept a ratio below 1:1", async ({
  page,
}) => {
  await page.goto("/water-lye-ratio");
  await page.getByLabel("Water to lye ratio").fill("0.5");
  // Below 1:1 exceeds the 50% safety ceiling — the concentration field
  // should not silently update to an unsafe value.
  await expect(page.getByLabel("Lye concentration percent")).not.toHaveValue(
    "66.67"
  );
});

test("water:lye ratio converter computes water weight for a known lye amount", async ({
  page,
}) => {
  await page.goto("/water-lye-ratio");
  await page.getByLabel("Lye weight in grams").fill("150");
  await expect(page.getByTestId("result")).toContainText("Water needed:");
});

test("oil SAP reference page lists common oils", async ({ page }) => {
  await page.goto("/oil-sap-reference");
  await expect(page.getByRole("cell", { name: /^Olive Oil$/ })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: /Coconut Oil/ })
  ).toBeVisible();
});

test("homepage links reach every tool", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("tool-card-lye-calculator").click();
  await expect(page).toHaveURL(/\/lye-calculator$/);
});
