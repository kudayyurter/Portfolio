import type { ReactNode } from "react";
import { PixelReveal } from "@/components/pixel-reveal";

export function Section({
  id,
  title,
  number,
  className = "",
  children,
}: {
  id: string;
  title: string;
  number: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`section container ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="section__heading">
        <span className="section__number" aria-hidden="true">
          {number}
        </span>
        <PixelReveal className="section__title-wrap">
          <h2 id={`${id}-title`} className="section__title">
            {title}
          </h2>
        </PixelReveal>
        <span className="section__rule" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}
