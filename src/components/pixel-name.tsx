import type { CSSProperties } from "react";
import { textToBitmap } from "@/lib/pixel-font";

const WORDS = ["KUDAY", "YURTER"];
const WORD_GAP = 4; // columns between the words on one line
const LINE_GAP = 2; // rows between the words when stacked
const DRAW_MS = 800;

// Scatters dot start times across DRAW_MS in a fixed order, so server and client markup match.
function dotDelay(index: number, total: number) {
  return Math.round((((index * 37) % total) / total) * DRAW_MS);
}

// One grid per word, with dots numbered across both words so the draw-in
// scatters over the whole name; computed once since the name never changes.
const LAYOUT = (() => {
  let index = 0;
  return WORDS.map((word) => {
    const rows = textToBitmap(word);
    const dots: { x: number; y: number; index: number }[] = [];
    rows.forEach((row, y) =>
      [...row].forEach((pixel, x) => {
        if (pixel === "1") dots.push({ x, y, index: index++ });
      }),
    );
    return { word, dots, width: rows[0].length };
  });
})();
const TOTAL = LAYOUT.reduce((sum, { dots }) => sum + dots.length, 0);
// Column counts CSS needs to keep one pixel size across both layouts.
const GRID = {
  "--word-gap": WORD_GAP,
  "--line-gap": LINE_GAP,
  "--line-columns":
    LAYOUT.reduce((sum, { width }) => sum + width, 0) +
    WORD_GAP * (WORDS.length - 1),
  "--widest-columns": Math.max(...LAYOUT.map(({ width }) => width)),
} as CSSProperties;

/**
 * "KUDAY YURTER", one SVG per word. CSS sets each word's width from its
 * column count, so both share one pixel size on one line or stacked.
 */
export function PixelName() {
  return (
    <span className="pixel-name" aria-hidden="true" style={GRID}>
      {LAYOUT.map(({ word, dots, width }) => (
        <svg
          key={word}
          viewBox={`0 0 ${width} 7`}
          fill="currentColor"
          style={{ "--columns": width } as CSSProperties}
        >
          {dots.map(({ x, y, index }) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width=".91"
              height=".91"
              style={
                {
                  "--delay": `${dotDelay(index, TOTAL)}ms`,
                } as CSSProperties
              }
            />
          ))}
        </svg>
      ))}
    </span>
  );
}
