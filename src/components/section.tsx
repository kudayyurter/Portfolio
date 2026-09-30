import type { ReactNode } from "react";
import { PixelReveal } from "@/components/pixel-reveal";

export function Section({
  id,
  title,
  className = "",
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`section container ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <PixelReveal className="section__title-wrap">
        <h2 id={`${id}-title`} className="section__title">
          {title}
        </h2>
      </PixelReveal>
      {children}
    </section>
  );
}
