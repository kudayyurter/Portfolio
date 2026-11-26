import type { CSSProperties } from "react";
import { orbit, tiledTerminals } from "@/content/project-icons";
import { bitmapPath } from "@/lib/pixel-font";

/** Decorative project illustrations; the row's single link owns interaction. */
export function FeaturedProjectArt({
  kind,
  name,
}: {
  kind: "orbit" | "terminals";
  name: string;
}) {
  return (
    <span className={`project__art project__art--${kind}`} aria-hidden="true">
      <span className="project__art-grid" />
      <span className="project__icon">
        {kind === "orbit" ? (
          <svg
            viewBox="0 0 12 12"
            fill="currentColor"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <path d={bitmapPath(orbit)} />
            <g className="project__satellite">
              <rect x="9" y="1" width="2" height="2" />
              <rect x="9.6" y="1.6" width=".8" height=".8" fill="white" />
            </g>
          </svg>
        ) : (
          <svg
            viewBox="0 0 11 10"
            fill="currentColor"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <g className="project__pane project__pane--left">
              <path d={bitmapPath(tiledTerminals)} />
            </g>
            <g className="project__pane project__pane--right">
              <path d={bitmapPath(tiledTerminals)} />
            </g>
          </svg>
        )}
      </span>
      <span className="project__art-caption">
        <span>{name}</span>
        <span className="project__art-cross" />
      </span>
      <span className="project__art-shutter">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            style={
              { "--tile-delay": `${((index * 7) % 12) * 12}ms` } as CSSProperties
            }
          />
        ))}
      </span>
    </span>
  );
}
