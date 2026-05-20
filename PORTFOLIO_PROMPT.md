# 🚀 ULTRA PORTFOLIO — FULL PROMPT FOR CLAUDE SONNET 4.6

> **Copy this entire prompt and send it to Claude Sonnet 4.6 to generate your dream portfolio.**
> Fill in the `[PLACEHOLDER]` sections with your own info before sending.

---

## ──────────────────────────────────────────
## SYSTEM CONTEXT
## ──────────────────────────────────────────

You are a world-class creative developer and UI/UX engineer who specializes in jaw-dropping, award-winning portfolio websites. Your code is production-grade, pixel-perfect, and pushes the limits of what is possible in the browser. You think like a designer and code like an engineer. You never produce generic, templated work — every line of code serves a visual or experiential purpose.

---

## ──────────────────────────────────────────
## THE MISSION
## ──────────────────────────────────────────

Build a **single-file React (JSX) portfolio** for `[YOUR NAME]`, a `[YOUR ROLE — e.g. Full-Stack Developer / UI/UX Designer / Creative Engineer]`. This portfolio must be so visually stunning, so technically impressive, and so buttery-smooth that every visitor stops scrolling and says *"I have never seen anything like this."*

This is not a standard portfolio. This is an **interactive, immersive digital experience.**

---

## ──────────────────────────────────────────
## PERSONAL DETAILS (fill in before sending)
## ──────────────────────────────────────────

```
NAME:         [Your Full Name]
ROLE:         [Your Job Title, e.g. "Full-Stack Developer & Creative Technologist"]
TAGLINE:      [One punchy line, e.g. "I build things that feel alive."]
BIO:          [2–3 sentences about you. Your background, passion, philosophy.]
LOCATION:     [City, Country]
EMAIL:        [your@email.com]
GITHUB:       [github.com/yourhandle]
LINKEDIN:     [linkedin.com/in/yourhandle]
TWITTER/X:    [x.com/yourhandle]
SKILLS:       [e.g. React, Node.js, Three.js, Figma, Python, TypeScript, AWS]

PROJECTS (list 3–5):
  1. Name: [Project 1 Name]
     Desc:  [1–2 sentence description]
     Stack: [Tech used]
     Link:  [Live URL or GitHub]
     Color: [Pick a hex accent color for this card, e.g. #FF4D00]

  2. Name: [Project 2 Name]
     Desc:  [1–2 sentence description]
     Stack: [Tech used]
     Link:  [Live URL or GitHub]
     Color: [e.g. #00FFB2]

  3. Name: [Project 3 Name]
     Desc:  [1–2 sentence description]
     Stack: [Tech used]
     Link:  [Live URL or GitHub]
     Color: [e.g. #7B61FF]

EXPERIENCE (list 2–4):
  1. Company: [Company Name]  |  Role: [Your Role]  |  Period: [2022–Present]
  2. Company: [Company Name]  |  Role: [Your Role]  |  Period: [2020–2022]
```

---

## ──────────────────────────────────────────
## DESIGN AESTHETIC
## ──────────────────────────────────────────

### Color Palette
- **Background:** Deep obsidian black `#050508` with micro-noise grain texture overlay
- **Primary Accent:** Electric acid lime `#C6FF00` (used sparingly for maximum contrast punch)
- **Secondary Accent:** Ice white `#F0F0F0`
- **Tertiary:** Muted cool gray `#3A3A4A`
- **Glow Color:** Semi-transparent lime `rgba(198, 255, 0, 0.15)` for bloom/glow effects
- **All colors defined as CSS custom properties on `:root`**

### Typography
- **Display / Hero Font:** `Bebas Neue` from Google Fonts — ultra-wide, cinematic, compressed. Size range: `clamp(4rem, 15vw, 14rem)`. Letter-spacing: `-0.02em`.
- **Body / UI Font:** `DM Mono` from Google Fonts — technical, clean, slightly cold. Used for nav, labels, descriptions.
- **Accent / Italic Font:** `Playfair Display Italic` for subtle editorial contrast on section headers.
- **Import all three from Google Fonts at the top of the file.**

### Visual Language
- Extremely dark base with tactical use of light (think: neon signs in a pitch-black room)
- Grain/noise texture overlaid on the entire page via a CSS pseudo-element with SVG `feTurbulence`
- Magnetic, elastic cursor that deforms and reacts to elements
- Horizontal + vertical rule lines (1px, `rgba(255,255,255,0.06)`) forming a subtle grid backdrop
- Lime accent bleeds — when you hover any interactive element, a soft lime glow radiates from it
- Cards and panels have `backdrop-filter: blur(12px)` + glass-morphism borders `rgba(255,255,255,0.05)`

---

## ──────────────────────────────────────────
## TECH STACK & LIBRARIES
## ──────────────────────────────────────────

Use **React (JSX) in a single file**. Import all dependencies via CDN / esm.sh. Use:

```js
import * as THREE from 'three';                        // 3D WebGL background
import { gsap } from 'gsap';                           // Master animation timeline
import { ScrollTrigger } from 'gsap/ScrollTrigger';   // Scroll-driven animations
import { useEffect, useRef, useState } from 'react';
```

> All GSAP and Three.js logic lives inside `useEffect` hooks with proper cleanup.

---

## ──────────────────────────────────────────
## SECTIONS — FULL SPECIFICATION
## ──────────────────────────────────────────

### 0. GLOBAL LAYER — Always Present

**Custom Cursor**
- Replace the default cursor entirely.
- Two elements: a small `8px` white dot (`.cursor-dot`) that follows the mouse exactly with zero lag, and a larger `40px` ring (`.cursor-ring`) that follows with elastic `lerp` delay (ease factor `0.12`).
- On hover over any clickable: `.cursor-ring` scales to `2x`, color flips to lime, and the dot disappears.
- On click: `.cursor-ring` scales down briefly to `0.8x` then snaps back (spring effect via GSAP).
- Implemented in a `useCursor` custom hook with `requestAnimationFrame` loop.

**Noise Grain Overlay**
- A full-screen fixed `<canvas>` or `::after` pseudo-element at `z-index: 9999`, `pointer-events: none`, `opacity: 0.035`.
- Animate the grain by translating the background noise pattern every `100ms` in a `setInterval` to create a film-grain flicker effect.
- Use SVG `feTurbulence` filter: `<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>`.

**Scroll Progress Bar**
- A 2px thick horizontal line at the very top of the viewport, fixed position.
- Color: lime gradient. Width animates from `0%` → `100%` as the user scrolls through the entire page.
- Implemented via a `scroll` event listener updating a CSS variable `--scroll-progress`.

**Magnetic Navbar**
- Fixed at top. Transparent background with `backdrop-filter: blur(20px)` and a very subtle bottom border `1px solid rgba(255,255,255,0.04)`.
- Logo: `[INITIALS]` in Bebas Neue, lime colored, with a hover glow pulse.
- Nav Links: `HOME · WORK · SKILLS · ABOUT · CONTACT` in DM Mono uppercase, `0.9rem`.
- Each nav link has a magnetic hover effect: when the mouse approaches within `80px`, the link floats toward the cursor (translate X/Y by `30%` of offset distance using `mousemove` listener).
- Active section highlighting: the current section's nav link has an underline that draws in from left using a CSS `scaleX` transform.
- Mobile: hamburger menu that morphs into an X. On open, a full-screen overlay slides down with staggered link reveals.

---

### 1. HERO SECTION

**Three.js Background — Particle Field**
- A `<canvas>` fills the full viewport (`position: absolute`, `z-index: 0`).
- Spawn `2,500` particles as `THREE.Points` with `THREE.BufferGeometry`.
- Each particle is a small white dot (`THREE.PointsMaterial`, size `0.8`, `sizeAttenuation: true`).
- Particles are distributed in a wide sphere formation (radius `80` units).
- **Wave distortion**: Each particle's Y position oscillates using `sin(time + particle.x * 0.05)` on every animation frame, creating a living, breathing wave field.
- **Mouse interaction**: On `mousemove`, calculate the normalized mouse vector and push particles away from the mouse position (repulsion force `2.5`, falloff with distance squared). Particles spring back using a `lerp(current, target, 0.05)` on every frame.
- **Scroll parallax**: As the user scrolls past the hero, the particle field rotates on the Y axis (connecting scroll position to `camera.rotation.y`).
- Camera positioned at `z: 60`, no orbit controls needed.

**Hero Content (above the canvas)**
- Vertical layout, centered, `z-index: 10`, positioned lower in the viewport (not dead center — more like 55% down).
- **Pre-header label**: `◆ AVAILABLE FOR WORK` in DM Mono, `0.75rem`, lime color, letter-spacing `0.2em`. Fades + slides up on load (delay `0.3s`).
- **Name**: Full name in Bebas Neue. Size: `clamp(5rem, 14vw, 13rem)`. The name is **split into individual characters**, each character wrapped in a `<span>`. On page load, characters animate in with GSAP `from({ y: '120%', opacity: 0 })` staggered at `0.04s` intervals, with a slight `rotateX(15deg)` that resolves to `0deg` — a cinematic 3D flip-in.
- **Role**: Below the name in Playfair Display Italic, `clamp(1.2rem, 2.5vw, 2rem)`, white, `opacity: 0.7`. Animates in after the name (delay `0.8s`), sliding up from below.
- **Tagline**: DM Mono, `0.9rem`, lime, `opacity: 0.8`. A **typewriter effect** — each character types in one by one at `60ms` intervals, with a blinking cursor at the end.
- **CTA Buttons** — two inline buttons:
  1. `VIEW MY WORK →` — solid lime background, black text, `font: DM Mono bold`, hover: scale `1.05` + outer glow pulse.
  2. `DOWNLOAD CV ↓` — transparent, 1px lime border, lime text, hover: fills with lime (background expands from left using `::before` pseudo-element `scaleX` transform).
- **Scroll Indicator**: At the very bottom center of the hero — a thin vertical line (`60px`, `1px`, `rgba(255,255,255,0.3)`) with a small dot that slides down and loops endlessly (GSAP `yoyo` repeat). Text above reads `SCROLL` in DM Mono `0.65rem` letter-spacing `0.3em`.

**Hero Exit Animation**
- As the user scrolls past the hero, `ScrollTrigger` pins the section briefly then:
  - The name splits apart and disperses upward (each character has independent `y` and `opacity` driven by scroll progress).
  - The particle field zooms in (camera `z` decreases) creating a warp-speed effect.

---

### 2. ABOUT / BIO SECTION

**Layout**: Two-column grid on desktop, single column on mobile.

**Left Column — Visual**
- A stylized portrait placeholder: a `240px × 300px` container with a lime dashed border (`border: 1px dashed rgba(198,255,0,0.4)`), slightly rotated `(-2deg)`.
- Inside: initials in massive Bebas Neue (`8rem`), lime, centered. This is the avatar.
- A second identical container offset by `+8px +8px` positioned absolutely behind it (stacked card effect), filled with `rgba(198,255,0,0.05)`.
- On hover, the front card snaps to `rotation(0deg)` and the shadow card slides to `+12px +12px` — smooth spring via GSAP.
- Below the avatar: two stat counters that count up when scrolled into view:
  - `03+ YEARS EXP` and `20+ PROJECTS` in Bebas Neue `2.5rem`.
  - Counter animation: numbers count from `0` to target over `1.5s` using GSAP's `{val: 0}` tween with `onUpdate`.

**Right Column — Text**
- Section label: `◆ ABOUT` in DM Mono `0.75rem` lime, letter-spacing `0.2em`. Slide in from left on scroll entry.
- Heading: `[First Name]` in Bebas Neue `clamp(3rem, 7vw, 6rem)`. The heading has a **split-color effect**: first half white, second half lime — achieved with `background-clip: text` on overlapping spans.
- Bio paragraph: DM Mono `0.95rem`, `line-height: 1.9`, `opacity: 0.75`. Words are individually wrapped in spans and **revealed word-by-word** as the user scrolls — each word's opacity and `translateY` is driven by scroll progress via `ScrollTrigger`.
- Below bio: location + email displayed with small `◆` prefix icons.

---

### 3. WORK / PROJECTS SECTION

**Section Entrance**
- Heading `SELECTED WORK` in Bebas Neue `clamp(4rem, 10vw, 9rem)`. On scroll, the heading **slides in letter by letter** (GSAP `SplitText` style — manual character wrapping), with a stagger of `0.03s`. Simultaneously, a lime horizontal rule draws from left to right behind the text.

**Project Cards — Horizontal Scroll Track**

On desktop: a **horizontally scrolling panel**, pinned in the viewport while the user scrolls vertically. The horizontal track moves laterally as scroll progresses — creating a cinematic filmstrip of project cards.

- Implementation: `ScrollTrigger` with `pin: true` and `scrub: 1`. The track `div` has `display: flex`, `width: fit-content`. As the trigger scrubs, `gsap.to(track, { x: -(totalWidth - viewportWidth) })`.
- **Each project card** is `380px × 500px` (desktop), with:
  - Background: `rgba(255,255,255,0.025)` glassmorphism, `1px solid rgba(255,255,255,0.06)`, `border-radius: 16px`, `backdrop-filter: blur(8px)`.
  - **Color accent strip**: A `4px` wide vertical strip on the left edge of the card, using the project's unique accent color.
  - **Top area**: Large project number `01`, `02`, etc. in Bebas Neue `5rem`, `opacity: 0.06` — a massive watermark number in the card background.
  - **Middle**: Project name in Bebas Neue `2rem`, white. Short description in DM Mono `0.85rem`, `opacity: 0.6`, max 2 lines.
  - **Tags**: Tech stack chips — small pill shapes, `1px solid rgba(255,255,255,0.15)`, DM Mono `0.7rem`.
  - **Bottom**: Two buttons: `VIEW PROJECT →` and `< CODE >`.
  - **Hover**: The card lifts (`translateY: -12px`, `scale: 1.02`) + the accent color bleeds as a glow (`box-shadow: 0 20px 60px rgba(accentColor, 0.3)`). The color strip expands to `8px`. Transition: cubic-bezier spring `0.34, 1.56, 0.64, 1` over `0.5s`.
  - **Tilt Effect**: Each card has a `mousemove` 3D tilt — calculate cursor offset within card, apply `rotateX` and `rotateY` up to `±12deg` via GSAP `quickSetter`. On mouse leave, springs back to flat.

On mobile: vertical stacked cards, full width, scroll normally.

---

### 4. SKILLS SECTION

**Layout**: Full-width dark section with a dense, energetic feel.

**Heading**: `CAPABILITIES` in Bebas Neue. As it enters the viewport, each letter flies in from a random position on screen (GSAP `from({ x: random(-200, 200), y: random(-200, 200), opacity: 0, rotate: random(-45, 45) })`) and assembles into the word.

**Skill Bars — Animated**
- Two columns of skills.
- Each skill: label left (DM Mono `0.9rem`), percentage right (lime), and a horizontal progress bar between.
- Bar is a `4px` tall track. The filled portion starts at `0%` width and animates to the target percentage when scrolled into view (ScrollTrigger, `duration: 1.2s`, stagger `0.1s`, ease `"power3.out"`).
- The fill is a gradient: `from lime → to teal` with a shimmering **light sweep** that runs across the bar after it fills (a `::after` pseudo-element with a white diagonal gradient that translates from `-100%` to `200%` once).

**Tech Orbs**
- Below the bars: a row of tech/tool icons rendered as circles.
- Each orb: `64px` circle, dark fill, centered icon or text abbreviation, lime border `1px`.
- On hover: the orb **pops** (scale `1.3`, border-color brightens, a small tooltip fades in above), and a ripple ring expands from the orb center and fades out.

**Floating Keyword Cloud**
- Behind the skill content, scattered across the section background: the names of tools/languages in large, very low-opacity text (`opacity: 0.03–0.05`), rotated at various angles, positioned absolutely. They slowly drift — each keyword moves on a unique sine wave path at an extremely slow `20–40s` loop. This creates the feeling of floating in a knowledge space.

---

### 5. EXPERIENCE / TIMELINE SECTION

**Layout**: A vertical timeline, centered spine on desktop, left-aligned on mobile.

- **Spine**: A `2px` wide vertical line, initially `height: 0%`, animates to `100%` as the section enters viewport (ScrollTrigger, `scrub: true`). Color: lime.
- **Each Entry**:
  - Alternates left/right of the spine on desktop.
  - A `12px` lime circle on the spine marks the entry point — it scales in (`from scale 0`) as the line reaches it.
  - Entry card: same glassmorphism style, `border-radius: 12px`. Contains: period in DM Mono lime, company name in Bebas Neue `1.6rem`, role in DM Mono `0.9rem` italic, and a 1-line description.
  - Entry animates in from the side (`x: -60` if left, `x: 60` if right, `opacity: 0`) triggered by ScrollTrigger `start: "top 75%"`.

---

### 6. CONTACT SECTION

**Full Viewport Height** — it feels like landing on a new planet.

**Background**: A radial gradient centered on the screen — from `rgba(198,255,0,0.07)` at center to transparent. Combined with a `THREE.js` mini-scene: 1–2 large, slowly rotating torus-knot wireframes in the background, lime colored, very dim (`opacity: 0.12`).

**Content, centered:**
- Giant text: `LET'S BUILD` + line break + `SOMETHING.` in Bebas Neue `clamp(5rem, 12vw, 11rem)`. The word `SOMETHING.` is lime. This text **breathes** — a subtle GSAP `yoyo` animation gently scales it between `0.98` and `1.01` on a `3s` loop.
- Below: `→ [your@email.com]` in DM Mono. On hover, the email underlines with a lime sweep, and clicking copies it to clipboard — showing a small `COPIED!` toast notification that pops up (scale in, hold, scale out).
- Social Links: GitHub, LinkedIn, Twitter — rendered as icon labels in DM Mono `0.85rem`. On hover: a lime line draws under them and the label shifts up `4px`.
- **Contact Form** (optional — include if user wants):
  - 3 fields: Name, Email, Message.
  - Fields have a sharp-cornered lime bottom border only (no box). On focus, the border color brightens and a lime glow appears below the field.
  - Submit button: same CTA style as hero. On submit, it morphs into a spinner, then into a checkmark with a `SUCCESS` label.

**Footer**: Single line, bottom of the page. `© 2025 [NAME] — DESIGNED & BUILT WITH ❤️` in DM Mono `0.75rem` centered, `opacity: 0.3`.

---

## ──────────────────────────────────────────
## SCROLL & PAGE BEHAVIOR
## ──────────────────────────────────────────

**Smooth Scrolling**
- Implement a custom smooth scroll engine using `requestAnimationFrame` and `lerp(currentY, targetY, 0.085)`.
- The actual DOM scroll position lags smoothly behind the native scroll wheel delta.
- This is the single most impactful thing for the "buttery" feel.
- Store real scroll position in a `ref`, update via wheel/touch events, apply to a wrapper `div`'s `transform: translateY()`.

**Page Load Sequence** (orchestrated with GSAP timeline, total ~2s)
1. `t=0s`: Black screen. A small lime `◆` in the center. Scale in `0 → 1`, `duration: 0.4s`.
2. `t=0.4s`: The `◆` expands outward as a circle that fills the screen (radial scale), then fades out. This is the page reveal.
3. `t=0.6s`: Navbar items stagger in from top (`y: -20, opacity: 0`), stagger `0.1s`.
4. `t=0.8s`: Hero content begins its entrance sequence (pre-header → name characters → role → tagline typewriter).
5. `t=1.5s`: Scroll indicator appears.

**Section Entrance Philosophy**
- Every section has a `ScrollTrigger` with `start: "top 80%"`.
- Nothing is visible on load except the hero — all sections start with `opacity: 0`.
- Animations are designed to feel **earned** by scrolling, not automatic.

---

## ──────────────────────────────────────────
## RESPONSIVE DESIGN
## ──────────────────────────────────────────

Breakpoints:
- `≥ 1200px` — Desktop (full experience, horizontal scroll project track)
- `768px–1199px` — Tablet (vertical layout, scaled-down typography, reduced particles)
- `< 768px` — Mobile (single column, hamburger nav, no 3D tilt on cards, particle count reduced to `600`)

Typography is entirely `clamp()`-based — no hard breakpoints needed for text.

**Performance on Mobile:**
- Reduce `Three.js` particle count to `600` on mobile (`window.innerWidth < 768`).
- Disable the 3D card tilt effect on touch devices (`'ontouchstart' in window`).
- Disable the custom cursor on touch devices.
- Use `will-change: transform` on heavily animated elements.
- Use `transform` and `opacity` only — never animate `width`, `height`, `top`, `left` for performance.

---

## ──────────────────────────────────────────
## PERFORMANCE & CODE QUALITY
## ──────────────────────────────────────────

- All `useEffect` hooks return cleanup functions: remove event listeners, kill GSAP ScrollTriggers, dispose Three.js geometries/materials/renderers.
- `requestAnimationFrame` loops tracked with `useRef` and cancelled on unmount.
- `IntersectionObserver` used for section entrance animations as a fallback to ScrollTrigger where appropriate.
- CSS is written as a `<style>` tag injected via a `useEffect`, OR as a tagged template literal style block at the top of the file.
- CSS variables on `:root` for all colors, fonts, and spacing — easy theming.
- `aria-label` on all icon-only buttons. `role="navigation"` on nav. Semantic HTML (`<main>`, `<section>`, `<header>`, `<footer>`, `<nav>`).

---

## ──────────────────────────────────────────
## EXTRA DELIGHT DETAILS
## ──────────────────────────────────────────

1. **Easter Egg**: Typing `[YOUR INITIALS]` on the keyboard triggers a brief particle burst from the center of the screen — particles explode outward in a lime starburst pattern, then fade. A small toast appears: `"You found the easter egg 👾"`.

2. **Cursor Trail**: Behind the cursor dot, emit 6–8 fading ghost dots that follow with increasing delay (`lerp` factor `0.05, 0.08...`). Each ghost is smaller and more transparent than the last. Gives the cursor a comet tail effect.

3. **Scroll Snap Hints**: When the user's scroll velocity drops near a section boundary, a subtle nudge animation plays on the scroll indicator to hint the user to keep going.

4. **Time-Based Greeting**: The pre-header availability label changes based on the user's local time:
   - `00:00–05:59` → `◆ BURNING THE MIDNIGHT OIL`
   - `06:00–11:59` → `◆ GOOD MORNING — AVAILABLE FOR WORK`
   - `12:00–17:59` → `◆ AVAILABLE FOR WORK`
   - `18:00–23:59` → `◆ EVENING MODE — STILL BUILDING`

5. **Sound Toggle** *(optional)*: A small speaker icon in the bottom-right corner. When activated, subtle ambient UI sounds play on hover/click interactions (using the Web Audio API — short sine wave tones, not actual audio files).

---

## ──────────────────────────────────────────
## FINAL INSTRUCTION TO THE AI
## ──────────────────────────────────────────

Generate the **complete, fully working single-file React JSX code** for this portfolio. The output should be one single `.jsx` file with:

- All CSS inside a `<style>` tag injected via `useEffect`, OR inside a JS string constant applied with `dangerouslySetInnerHTML` to a `<style>` element.
- All Three.js, GSAP, and other library imports via `esm.sh` or CDN import maps at the top.
- All sections implemented as described above — **do not skip any section**.
- The personal data (name, projects, skills, experience) filled in with the values provided in the "Personal Details" section above.
- The code is fully functional, production-quality, and runs in a single browser window with no build step (using ESM imports).

**Do not summarize. Do not abbreviate. Do not use placeholder comments like `// ... rest of component`. Write every single line.**

The output should make anyone who sees it say: *"This is the most impressive portfolio I have ever seen."*

---

*Prompt crafted for Claude Sonnet 4.6 | Single-file React JSX | Three.js + GSAP + Custom Scroll Engine*
