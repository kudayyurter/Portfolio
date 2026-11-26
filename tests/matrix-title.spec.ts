import { test, expect } from "@playwright/test";

test.use({ baseURL: process.env.TEST_BASE_URL || "http://localhost:3000" });

test("falling letters travel down and settle into a complete, still title", async ({ page }) => {
  await page.goto("/");
  const streams = page.locator(".matrix-stream");
  expect(await streams.count()).toBeGreaterThan(0);
  expect(await streams.first().textContent()).toMatch(/[A-Z]/);

  // Seek the actual CSS animation so a slow CI page load cannot miss the fall.
  const positions = await streams.first().evaluate((stream) => {
    const animation = stream.getAnimations()[0];
    animation.pause();
    const timing = animation.effect!.getTiming();
    const duration = Number(timing.duration);
    animation.currentTime = Number(timing.delay) + duration * 0.2;
    const before = stream.getBoundingClientRect().top;
    animation.currentTime = Number(timing.delay) + duration * 0.7;
    const after = stream.getBoundingClientRect().top;
    animation.finish();
    return { before, after };
  });
  expect(positions.after).toBeGreaterThan(positions.before);

  await expect.poll(() => page.locator(".pixel-name").evaluate((title) => {
    const letters = [...title.querySelectorAll(".pixel-name__letter")];
    const streams = [...title.querySelectorAll(".matrix-stream")];
    return letters.map((letter) => letter.textContent).join("") === "KUDAYYURTER" &&
      letters.every((letter) => getComputedStyle(letter).opacity === "1") &&
      streams.every((stream) => getComputedStyle(stream).opacity === "0") &&
      title.getAnimations({ subtree: true }).every((animation) => animation.playState === "finished");
  })).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Kuday Yurter");
});

test("changing to reduced motion stops the rain and reveals the whole title", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".matrix-stream").first()).toBeAttached();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".matrix-stream").first()).toHaveCSS("display", "none");
  expect(await page.locator(".pixel-name").evaluate((title) => ({
    lettersVisible: [...title.querySelectorAll(".pixel-name__letter")].length === 11 &&
      [...title.querySelectorAll(".pixel-name__letter")].every((letter) => getComputedStyle(letter).opacity === "1"),
    running: title.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
  }))).toEqual({ lettersVisible: true, running: 0 });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the title is complete without waiting for rain", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".matrix-stream").first()).toHaveCSS("display", "none");
    expect(await page.locator(".pixel-name__letter").evaluateAll((letters) =>
      letters.map((letter) => letter.textContent).join("") === "KUDAYYURTER" &&
      letters.every((letter) => getComputedStyle(letter).opacity === "1"),
    )).toBe(true);
  });
});

test("the name and falling letters share the loaded local typeface", async ({ page }) => {
  await page.goto("/");
  const font = await page.evaluate(async () => {
    await document.fonts.ready;
    const letter = document.querySelector(".pixel-name__letter");
    const stream = document.querySelector(".matrix-stream");
    if (!letter || !stream) return null;
    const family = getComputedStyle(letter).fontFamily;
    const primary = family.split(",")[0].trim().replaceAll('"', "");
    return {
      same: family === getComputedStyle(stream).fontFamily,
      loaded: [...document.fonts].some((font) =>
        font.family.replaceAll('"', "") === primary && font.status === "loaded",
      ),
    };
  });
  expect(font).toEqual({ same: true, loaded: true });
});

test("failed fonts leave a readable name and do not overflow the phone layout", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/\.woff2(?:\?|$)/, (route) => route.abort());
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator(".pixel-name__letter").allTextContents()).toEqual([..."KUDAYYURTER"]);
  for (const letter of await page.locator(".pixel-name__letter").all()) {
    await expect(letter).toBeVisible();
  }
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )).toBe(0);
});
