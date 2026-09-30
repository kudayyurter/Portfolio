"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import portraitHead from "@/assets/portrait-head.webp";

/** Each nav link, and the page sections that count as reading it. */
const NAV: { label: string; href: string; sections: string[] }[] = [
  { label: "About", href: "#about", sections: ["about"] },
  {
    label: "Experience",
    href: "#experience",
    sections: ["experience", "stack"],
  },
  { label: "Projects", href: "#projects", sections: ["projects", "personal"] },
  { label: "Contact", href: "#contact", sections: ["contact"] },
];

export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    // The section crossing a thin line just under mid-screen is the one being
    // read. The last section is too short to reach that line, so the bottom of
    // the page counts as Contact.
    const ids = NAV.flatMap((item) => item.sections);
    const crossing = new Set<string>();
    const pickActive = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const id = atBottom
        ? "contact"
        : ids.find((section) => crossing.has(section));
      setActive(
        NAV.find((item) => id && item.sections.includes(id))?.href ?? null,
      );
    };
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        }
        pickActive();
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    }

    const update = () => {
      header.dataset.scrolled = String(window.scrollY > 8);
      pickActive();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });

    // The nav wraps when text is enlarged, so publish the real header height
    // for scroll-padding; otherwise anchor jumps land under a taller header.
    const root = document.documentElement;
    const resize = new ResizeObserver(([entry]) => {
      root.style.setProperty(
        "--header-height",
        `${entry.borderBoxSize[0].blockSize}px`,
      );
    });
    resize.observe(header);

    return () => {
      window.removeEventListener("scroll", update);
      spy.disconnect();
      resize.disconnect();
      root.style.removeProperty("--header-height");
    };
  }, []);

  // Parks the marker square just left of the active link, re-measuring
  // whenever the nav reflows (a wrapped nav moves its links).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !active) return;
    const place = () => {
      const link = nav.querySelector<HTMLElement>(`a[href="${active}"]`);
      if (!link) return;
      nav.style.setProperty("--marker-x", `${link.offsetLeft - 10}px`);
      nav.style.setProperty(
        "--marker-y",
        `${link.offsetTop + link.offsetHeight / 2 - 2}px`,
      );
    };
    place();
    const reflow = new ResizeObserver(place);
    reflow.observe(nav);
    return () => reflow.disconnect();
  }, [active]);

  return (
    <header ref={ref} className="site-header" data-scrolled="false">
      <div className="site-header__inner container">
        <a className="site-header__home" href="#top" aria-label="Back to top">
          <Image
            src={portraitHead}
            alt=""
            width={44}
            height={44}
            loading="eager"
          />
        </a>
        <nav
          ref={navRef}
          className="site-nav"
          aria-label="Primary"
          data-active={active ? "" : undefined}
        >
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={href === active ? "location" : undefined}
            >
              {label}
            </a>
          ))}
          <span className="site-nav__marker" aria-hidden="true" />
        </nav>
      </div>
    </header>
  );
}
