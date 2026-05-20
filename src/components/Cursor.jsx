import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../motion";

const TRAIL_COUNT = 7;
const TRAIL_LERPS = [0.22, 0.18, 0.14, 0.11, 0.08, 0.06, 0.04];

const shouldDisableCursor = () =>
  "ontouchstart" in window || prefersReducedMotion();

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trailPos = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })),
  );
  const raf = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (shouldDisableCursor()) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    // gsap.quickTo for instant performance
    const xTo = gsap.quickTo(dotRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yTo = gsap.quickTo(dotRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });

    const rxTo = gsap.quickTo(ringRef.current, "x", {
      duration: 0.4,
      ease: "power2",
    });
    const ryTo = gsap.quickTo(ringRef.current, "y", {
      duration: 0.4,
      ease: "power2",
    });

    // trail quickSetters
    const trailSetters = trailRefs.current.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power1" }),
      y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power1" }),
    }));

    const onMouseOver = (e) => {
      const target = e.target.closest(
        'a, button, [role="button"], input, textarea, .project-card, .exp-card, .sphere-item',
      );
      if (target) {
        const fromElement = e.relatedTarget;
        if (!fromElement || !target.contains(fromElement)) {
          setHovering(true);
        }
      }
    };
    const onMouseOut = (e) => {
      const target = e.target.closest(
        'a, button, [role="button"], input, textarea, .project-card, .exp-card, .sphere-item',
      );
      if (target) {
        const toElement = e.relatedTarget;
        if (!toElement || !target.contains(toElement)) {
          setHovering(false);
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mouseout", onMouseOut, { passive: true });

    let raf;
    const tick = () => {
      if (!document.hidden) {
        rxTo(pos.current.x);
        ryTo(pos.current.y);
        trailSetters.forEach((s, i) => {
          s.x(pos.current.x);
          s.y(pos.current.y);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (shouldDisableCursor()) return null;

  return (
    <>
      {/* Comet trail ghosts */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          style={{
            position: "fixed",
            width: `${6 - i * 0.6}px`,
            height: `${6 - i * 0.6}px`,
            borderRadius: "50%",
            background: "var(--accent)",
            opacity: 0.35 - i * 0.045,
            pointerEvents: "none",
            zIndex: 99997,
            transform: "translate(-50%,-50%)",
            mixBlendMode: "difference",
            backgroundColor: "var(--white)",
          }}
        />
      ))}
      {/* Main dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: hovering ? 0 : 1,
          mixBlendMode: "difference",
          backgroundColor: "var(--white)",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className={`cursor-ring${hovering ? " hovering" : ""}${clicking ? " clicking" : ""}`}
        style={{
          mixBlendMode: hovering ? "normal" : "difference",
          borderColor: "var(--white)",
        }}
      />
    </>
  );
}
