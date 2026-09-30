import { test, expect, type Page } from "@playwright/test";

test.use({ baseURL: process.env.TEST_BASE_URL || "http://localhost:3000" });

const SECTIONS = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Contact", "contact"],
] as const;
const COMPANIES = [
  "Cummins",
  "Engrave Me Now",
  "University of Houston",
  "IFixandRepair",
];
const WORK_PROJECTS = [
  "Turbo Balancer dashboards",
  "Balancer correction model",
  "Engineering AI agents",
  "Skills & Capabilities app",
  "CCS AI SharePoint site",
  "Store sales & inventory system",
];
const PERSONAL_PROJECTS = [
  "Kessler",
  "Dispatch",
  "Snake Game",
  "Clash of Valor",
  "Lumon boot splash",
];
const STACK = [
  "Python",
  "SQL",
  "Databricks",
  "Power Platform",
  "React",
  "TypeScript",
  "JavaScript",
  "Linux",
  "Git",
  "C / C++",
  "Power BI",
  "scikit-learn",
  "Copilot Studio",
  "AWS",
  "Azure",
  "Docker",
  "Neovim",
  "Rust",
  "C#",
  ".NET",
  "Node.js",
  "FastAPI",
  "Unreal Engine",
  "Unity",
  "MATLAB",
];

async function expectAllContent(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: "Kuday Yurter" }),
  ).toBeVisible();
  for (const [, id] of SECTIONS) {
    await expect(page.locator(`#${id} h2`)).toBeAttached();
  }
  for (const name of [...COMPANIES, ...WORK_PROJECTS, ...PERSONAL_PROJECTS]) {
    await expect(page.getByRole("heading", { level: 3, name })).toBeAttached();
  }
  await expect(
    page.getByRole("link", { name: /kudayyurter@gmail\.com/ }),
  ).toBeAttached();
}

test("renders every section and the key content", async ({ page }) => {
  await page.goto("/");
  await expectAllContent(page);
  await expect(page.getByRole("img", { name: "Python" })).toBeAttached();
  await expect(page.getByRole("img", { name: "Cummins" })).toBeAttached();
});

test("the top of the page is just the name, on one line", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1 svg")).toHaveCount(1);
  await expect(page.getByRole("img", { name: /portrait/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "View projects" })).toHaveCount(
    0,
  );
  await expect(page.locator(".results")).toHaveCount(0);
});

test("the header portrait is at least 44px, with no circle frame", async ({
  page,
}) => {
  await page.goto("/");
  const avatar = page.locator(".site-header__home img");
  const box = await avatar.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  await expect(avatar).not.toHaveCSS("image-rendering", "pixelated");
  await expect(avatar).toHaveCSS("border-radius", "0px");
  await expect(avatar).toHaveCSS("box-shadow", "none");
});

test("company and school logos have no box around them", async ({ page }) => {
  await page.goto("/");
  const widths = await page
    .locator(".monogram")
    .evaluateAll((boxes) =>
      boxes.map((box) => getComputedStyle(box).borderTopWidth),
    );
  expect(widths.length).toBeGreaterThan(0);
  expect(new Set(widths)).toEqual(new Set(["0px"]));
});

test("lists every job, newest first", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("#experience h3").allInnerTexts()).toEqual(
    COMPANIES,
  );
});

test("the tech stack uses real logos, best-known first", async ({ page }) => {
  await page.goto("/");
  const logos = page.locator("#stack .stack-grid img");
  expect(
    await logos.evaluateAll((images) =>
      images.map((image) => image.getAttribute("alt")),
    ),
  ).toEqual(STACK);
  expect(
    await logos.evaluateAll((images) =>
      images.every((image) => image.getAttribute("src")?.endsWith(".svg")),
    ),
  ).toBe(true);
});

test("work and personal projects are separate sections", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("#projects h3").allInnerTexts()).toEqual(
    WORK_PROJECTS,
  );
  expect(await page.locator("#personal h3").allInnerTexts()).toEqual(
    PERSONAL_PROJECTS,
  );
  await expect(
    page.locator("#personal").getByRole("link", { name: /Kessler/ }),
  ).toHaveAttribute("href", "https://kessler.kudayyurter.dev");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("everything is present and visible", async ({ page }) => {
    await page.goto("/");
    await expectAllContent(page);
    for (const [, id] of SECTIONS) {
      await page.locator(`#${id} h2`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id} h2`)).toBeVisible();
    }
  });
});

test("header links jump to each section", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [name, id] of SECTIONS) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test("fits a 360px screen with no runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
  expect(errors).toEqual([]);
});

const MOTION =
  "(scripting: enabled) and (prefers-reduced-motion: no-preference)";

async function opacities(page: Page, selector: string) {
  return page.$$eval(selector, (elements) =>
    elements.map((element) => getComputedStyle(element).opacity),
  );
}

test("sections fade in as they scroll into view", async ({ page }) => {
  await page.goto("/");
  expect(
    await page.evaluate((query) => matchMedia(query).matches, MOTION),
  ).toBe(true);
  const contact = page.locator("#contact .reveal").first();
  await expect(contact).not.toHaveClass(/is-visible/);
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toHaveClass(/is-visible/);
  await expect(contact).toHaveCSS("opacity", "1");
});

test("a deep link reveals the targeted section", async ({ page }) => {
  await page.goto("/#projects");
  await expect(page.locator("#projects .reveal").first()).toHaveClass(
    /is-visible/,
  );
});

test("keyboard focus reveals the focused link", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /More on GitHub/ });
  await link.focus();
  await expect(page.locator(".reveal", { has: link })).toHaveClass(
    /is-visible/,
  );
});

test("printing shows sections that were never scrolled to", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ media: "print" });
  expect(new Set(await opacities(page, ".reveal"))).toEqual(new Set(["1"]));
});

test("header gets a hairline once the page scrolls", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  await expect(header).toHaveAttribute("data-scrolled", "false");
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(header).toHaveAttribute("data-scrolled", "true");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("everything is shown immediately", async ({ page }) => {
    await page.goto("/");
    expect(
      await page.evaluate((query) => matchMedia(query).matches, MOTION),
    ).toBe(false);
    expect(new Set(await opacities(page, ".reveal"))).toEqual(new Set(["1"]));
    expect(await page.locator(".reveal.is-visible").count()).toBe(0);
  });
});

test("section headings resolve when scrolled to", async ({ page }) => {
  await page.goto("/");
  const title = page.locator("#projects .pixel-reveal").first();
  expect(await title.getAttribute("data-state")).toBeNull();
  await title.scrollIntoViewIfNeeded();
  await expect(title).toHaveAttribute("data-state", "done");
  await expect(page.locator("#projects h2")).toBeVisible();
});

test("printing shows headings that never revealed", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ media: "print" });
  expect(
    new Set(await opacities(page, ".pixel-reveal > :first-child")),
  ).toEqual(new Set(["1"]));
  await expect(page.locator(".pixel-reveal__canvas:visible")).toHaveCount(0);
});

test.describe("with reduced motion, no pixel effects", () => {
  test.use({ reducedMotion: "reduce" });

  test("no canvas shows and nothing waits to reveal", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".pixel-reveal__canvas:visible")).toHaveCount(0);
    expect(await page.locator(".pixel-reveal[data-state]").count()).toBe(0);
    expect(
      new Set(await opacities(page, ".pixel-reveal > :first-child")),
    ).toEqual(new Set(["1"]));
  });
});

test("serves a link-preview image", async ({ page, request }) => {
  await page.goto("/");
  const content = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(content).toBeTruthy();
  // metadataBase points at production; fetch the same path from the local server.
  const { pathname, search } = new URL(content!);
  const response = await request.get(pathname + search);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("content still appears if the page's JavaScript fails to load", async ({
  page,
}) => {
  await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort());
  await page.goto("/");
  await page.waitForTimeout(3500);
  expect(new Set(await opacities(page, ".reveal"))).toEqual(new Set(["1"]));
  expect(
    new Set(await opacities(page, ".pixel-reveal > :first-child")),
  ).toEqual(new Set(["1"]));
  expect(new Set(await dividerScales(page))).toEqual(new Set([1]));
});

test("the failsafe does not reveal content early when JavaScript works", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(3500);
  await expect(page.locator("#contact .reveal").first()).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(page.locator("#contact h2")).toHaveCSS("opacity", "0");
});

test("Cummins and University of Houston show their real logos", async ({
  page,
}) => {
  await page.goto("/");
  for (const [name, file] of [
    ["Cummins", "cummins.svg"],
    ["University of Houston", "uh.svg"],
  ]) {
    await expect(
      page.locator(`#experience img[alt="${name}"]`),
    ).toHaveAttribute("src", new RegExp(`/logos/${file}$`));
  }
  await expect(page.locator("#experience svg[aria-label]")).toHaveCount(2);
});

test("education shows the school's logo", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('.education img[alt="Texas A&M University–Victoria"]'),
  ).toHaveAttribute("src", /\/logos\/tamuv\.svg$/);
});

test("never says where in the US Kuday lives", async ({ page }) => {
  await page.goto("/");
  const text = (await page.locator("body").innerText())
    .replaceAll("University of Houston", "")
    .replaceAll("Houston City College", "");
  expect(text).not.toMatch(/Houston|Katy|Columbus|, TX|, IN\b/);
  expect(text).toContain("Based in the US.");
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).not.toContain("Houston");
});

test("contact links are one size, each with its brand logo", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  const links = [
    contact.getByRole("link", { name: /kudayyurter@gmail\.com/ }),
    contact.getByRole("link", { name: /GitHub/ }),
    contact.getByRole("link", { name: /LinkedIn/ }),
  ];
  const sizes = await Promise.all(
    links.map((link) =>
      link.evaluate((element) => getComputedStyle(element).fontSize),
    ),
  );
  expect(new Set(sizes).size).toBe(1);
  for (const [link, file] of links.map(
    (link, index) =>
      [link, ["gmail.svg", "github.svg", "linkedin.svg"][index]] as const,
  )) {
    await expect(link.locator("img")).toHaveAttribute(
      "src",
      new RegExp(`/logos/${file}$`),
    );
  }
});

test("sections run About, Experience, Tech stack, Work, Personal, Contact", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page
      .locator("main > section[id]")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual([
    "about",
    "experience",
    "stack",
    "projects",
    "personal",
    "contact",
  ]);
});

test("secondary text meets 4.5:1 contrast on black", async ({ page }) => {
  await page.goto("/");
  const ratios = await page
    .locator(
      ".job__meta, .project__stack, .contact-note, .site-footer__inner, .eyebrow",
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        const [r, g, b] = getComputedStyle(element)
          .color.match(/\d+/g)!
          .slice(0, 3)
          .map((value) => {
            const channel = Number(value) / 255;
            return channel <= 0.03928
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return (luminance + 0.05) / 0.05;
      }),
    );
  expect(ratios.length).toBeGreaterThan(0);
  expect(Math.min(...ratios)).toBeGreaterThanOrEqual(4.5);
});

for (const width of [320, 360]) {
  test(`no horizontal overflow at 200% text size, ${width}px wide`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test("nav links are at least 44px tall", async ({ page }) => {
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const heights = await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link")
      .evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().height),
      );
    expect(Math.min(...heights), `at ${width}px`).toBeGreaterThanOrEqual(44);
  }
});

test("sends browser security headers", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["content-security-policy"]).toBe("frame-ancestors 'none'");
  expect(headers["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=()",
  );
});

test("sections use tighter spacing than the name-only top", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const padding = await page
    .locator("#about")
    .evaluate((section) => parseFloat(getComputedStyle(section).paddingTop));
  expect(padding).toBeLessThanOrEqual(96);
  await page.setViewportSize({ width: 360, height: 800 });
  const mobile = await page
    .locator("#about")
    .evaluate((section) => parseFloat(getComputedStyle(section).paddingTop));
  expect(mobile).toBeLessThanOrEqual(64);
});

test("nav jumps land below the header even when it wraps at 200% text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  // The measured height needs React to have started; before that the 64px
  // fallback applies by design. On slow CI machines, wait rather than race it.
  await page.waitForFunction(() =>
    getComputedStyle(document.documentElement).getPropertyValue(
      "--header-height",
    ),
  );
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await page.waitForFunction(
    () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) > 100,
  );
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [name, id] of SECTIONS) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    // Measure only where smooth scrolling ends, not while it passes by.
    await page.waitForFunction(
      () =>
        new Promise((resolve) => {
          const start = scrollY;
          setTimeout(() => resolve(scrollY === start), 200);
        }),
    );
    const { headerBottom, titleTop } = await page.evaluate(
      (id) => ({
        headerBottom: document
          .querySelector(".site-header")!
          .getBoundingClientRect().bottom,
        titleTop: document.querySelector(`#${id} h2`)!.getBoundingClientRect()
          .top,
      }),
      id,
    );
    expect(titleTop, `${name} heading`).toBeGreaterThanOrEqual(headerBottom);
  }
});

/** How far each row's hairline has drawn, 0 to 1. */
async function dividerScales(page: Page) {
  return page.locator(".job, .project, .education").evaluateAll((elements) =>
    elements.map((element) => {
      const transform = getComputedStyle(element, "::before").transform;
      return transform === "none" ? 1 : new DOMMatrix(transform).a;
    }),
  );
}

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((id) => {
    const top = document.getElementById(id)!.getBoundingClientRect().top;
    window.scrollTo({ top: scrollY + top, behavior: "instant" });
  }, id);
}

test("the nav marks the section being read", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const current = nav.locator('[aria-current="location"]');
  await expect(current).toHaveCount(0);
  await expect(nav.locator(".site-nav__marker")).toHaveCSS("opacity", "0");
  for (const [id, label] of [
    ["about", "About"],
    ["experience", "Experience"],
    ["stack", "Experience"],
    ["projects", "Projects"],
    ["personal", "Projects"],
  ]) {
    await scrollToSection(page, id);
    await expect(current, `at #${id}`).toHaveText(label);
  }
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await expect(current).toHaveText("Contact");
  await expect(nav.locator(".site-nav__marker")).toHaveCSS("opacity", "1");
});

test("row dividers draw in when scrolled to", async ({ page }) => {
  await page.goto("/");
  const lastRow = page.locator("#personal .project").last();
  const scale = () =>
    lastRow.evaluate((element) => {
      const transform = getComputedStyle(element, "::before").transform;
      return transform === "none" ? 1 : new DOMMatrix(transform).a;
    });
  // Rows start undrawn only once scripts have armed their reveal.
  await expect(lastRow.locator(".reveal")).toHaveAttribute("data-armed", "");
  expect(await scale()).toBe(0);
  await lastRow.scrollIntoViewIfNeeded();
  await expect.poll(scale).toBe(1);
});

test.describe("with reduced motion, dividers", () => {
  test.use({ reducedMotion: "reduce" });

  test("are fully drawn without scrolling", async ({ page }) => {
    await page.goto("/");
    expect(new Set(await dividerScales(page))).toEqual(new Set([1]));
  });
});

test.describe("without JavaScript, dividers", () => {
  test.use({ javaScriptEnabled: false });

  test("are fully drawn", async ({ page }) => {
    await page.goto("/");
    expect(new Set(await dividerScales(page))).toEqual(new Set([1]));
  });
});

test("link arrows are decorative and nudge on hover", async ({ page }) => {
  await page.goto("/");
  const arrows = page.getByText("↗", { exact: true });
  expect(await arrows.count()).toBeGreaterThan(0);
  for (const arrow of await arrows.all()) {
    await expect(arrow).toHaveClass(/\barrow\b/);
    await expect(arrow).toHaveAttribute("aria-hidden", "true");
  }
  const link = page.getByRole("link", { name: /More on GitHub/ });
  await link.scrollIntoViewIfNeeded();
  await link.hover();
  await expect(link.locator(".arrow")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 3, -3)",
  );
});

test("a personal project's whole row opens its link", async ({ page }) => {
  await page.goto("/");
  const row = page.locator(".project", {
    has: page.getByRole("heading", { level: 3, name: "Kessler" }),
  });
  await expect(row.getByRole("link")).toHaveCount(1);
  const href = await row.getByRole("link").getAttribute("href");
  // Answer the external page locally so the test never depends on the network.
  await page.context().route(href!, (route) => route.fulfill({ body: "" }));
  await row.scrollIntoViewIfNeeded();
  const popup = page.waitForEvent("popup");
  // A point on the row that is not the link text; the overlay catches it.
  await row.click({ position: { x: 40, y: 48 } });
  const opened = await popup;
  await opened.waitForURL(href!);
  await opened.close();
});

test("work project rows are not links", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#projects .project a")).toHaveCount(0);
  await expect(page.locator("#projects .project__frame")).toHaveCount(0);
});
