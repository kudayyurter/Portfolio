"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Status = "idle" | "copied" | "failed";

const LABELS: Record<Status, string> = {
  idle: "Copy",
  copied: "Copied ✓",
  failed: "Failed",
};
const ANNOUNCEMENTS: Record<Status, string> = {
  idle: "",
  copied: "Email copied",
  failed: "Could not copy the email",
};

const subscribe = () => () => {};
const canCopy = () => Boolean(navigator.clipboard?.writeText);

/**
 * Copies the email address and confirms in place. Every label sits in one grid
 * cell, so the button never changes size. Renders nothing without scripts or a
 * clipboard, where it could not work.
 */
export function CopyEmail({ email }: { email: string }) {
  const supported = useSyncExternalStore(subscribe, canCopy, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!supported) return null;

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = window.setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <>
      <button
        type="button"
        className="button copy-button"
        aria-label="Copy email address"
        onClick={copy}
      >
        <span className="copy-button__labels">
          {(Object.keys(LABELS) as Status[]).map((key) => (
            <span key={key} data-shown={key === status}>
              {LABELS[key]}
            </span>
          ))}
        </span>
      </button>
      <span className="sr-only" role="status">
        {ANNOUNCEMENTS[status]}
      </span>
    </>
  );
}
