"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { scrollSync } from "@/lib/scrollStore";

type CursorMode = "default" | "underline" | "text" | "card";

const CURSOR_STYLES = {
  default: {
    borderRadius: "9999px",
    backgroundColor: "rgba(255,255,255,1)",
    border: "2px solid rgba(255,255,255,0)",
    boxShadow: "none",
    duration: 0.15,
  },
  underline: {
    borderRadius: "0px",
    backgroundColor: "rgba(255,255,255,1)",
    border: "none",
    boxShadow: "none",
    duration: 0.15,
  },
  interactive: {
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "none",
    boxShadow: "none",
    duration: 0.15,
  },
};

const CURSOR_SIZES = {
  default: { width: 16, height: 16, duration: 0.25 },
  text: { width: 6, height: 28, duration: 0.25 },
  card: { width: 40, height: 40, duration: 0.3 },
  underline: { width: 0, height: 2, duration: 0.25 }, // width calculated dynamically
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const checkIdleRef = useRef<number>();
  const modeRef = useRef<CursorMode>("default");
  const targetRectRef = useRef<DOMRect | null>(null);

  const setCursorMode = useCallback((mode: CursorMode) => {
    if (modeRef.current === mode || !cursorRef.current) return;
    modeRef.current = mode;

    const style =
      mode === "underline"
        ? CURSOR_STYLES.underline
        : mode === "default"
          ? CURSOR_STYLES.default
          : CURSOR_STYLES.interactive;

    gsap.to(cursorRef.current, {
      ...style,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const target = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      const interactiveEl = target?.closest(
        "a, [role='link'], button",
      ) as HTMLElement | null;

      let mode: CursorMode = "default";
      let rect: DOMRect | null = null;

      if (interactiveEl) {
        rect = interactiveEl.getBoundingClientRect();
        const isLargeTarget = rect.width > 200 || rect.height > 100;

        if (isLargeTarget) {
          mode = "card";
        } else {
          const isTextLink =
            (interactiveEl.tagName.toLowerCase() === "a" ||
              interactiveEl.getAttribute("role") === "link") &&
            !interactiveEl.querySelector("img, svg") &&
            interactiveEl.tagName.toLowerCase() !== "button";
          mode = isTextLink ? "underline" : "default";
        }
      } else if (
        target?.closest(
          "input, textarea, [contenteditable='true'], p, span, li, h1, h2, h3, h4, h5, h6",
        )
      ) {
        mode = "text";
      }

      setCursorMode(mode);
      targetRectRef.current = rect;

      let targetX = e.clientX;
      let targetY = e.clientY;
      let size = CURSOR_SIZES[mode === "default" ? "default" : mode];

      if (mode === "underline" && rect) {
        size = { ...size, width: rect.width };
        targetX = rect.left + rect.width / 2;
        targetY = rect.bottom;
      }

    gsap.to(cursor, {
      x: targetX,
      y: targetY,
      duration: 0.02,
      ease: "linear",
      overwrite: "auto",
    });

    gsap.to(cursor, {
      width: size.width,
      height: size.height,
      duration: size.duration,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [setCursorMode]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("mousemove", onMouseMove);

    const checkIdle = () => {
      setIsHidden(scrollSync.isLensIdle);
      checkIdleRef.current = requestAnimationFrame(checkIdle);
    };
    checkIdle();

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", onMouseMove);
      if (checkIdleRef.current) {
        cancelAnimationFrame(checkIdleRef.current);
      }
    };
  }, [onMouseMove]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      style={{ opacity: isHidden ? 0 : 1 }}
    />
  );
}
