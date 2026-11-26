import type { CSSProperties } from "react";
import localFont from "next/font/local";

const departureMono = localFont({
  src: "../assets/fonts/DepartureMono-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["monospace"],
  adjustFontFallback: false,
});

const WORDS = ["KUDAY", "YURTER"];
const GLYPHS = "KYRXA01";

/** A finite character-rain entrance; the complete name is server-rendered. */
export function PixelName() {
  return (
    <span className={`pixel-name ${departureMono.className}`} aria-hidden="true">
      {WORDS.map((word, wordIndex) => (
        <span className="pixel-name__word" key={word}>
          {[...word].map((letter, index) => {
            const column = index + wordIndex * WORDS[0].length;
            return (
              <span
                key={index}
                className="pixel-name__cell"
                style={
                  { "--letter-delay": `${(column * 137) % 600}ms` } as CSSProperties
                }
              >
                <span className="matrix-stream">
                  {[0, 1, 2, 3].map((tail) => (
                    <span key={tail} style={{ opacity: 0.25 + tail * 0.25 }}>
                      {GLYPHS[(column + tail * 3) % GLYPHS.length]}
                    </span>
                  ))}
                </span>
                <span className="pixel-name__letter">{letter}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
