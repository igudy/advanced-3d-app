# 🏀 MASTER PROMPT — "SLAM DUNK" 3D Basketball Landing Page

> Paste this whole document into your AI tool (Claude, Cursor, v0, etc.) along with the reference screenshot.
> After the first generation, iterate **one issue at a time** using the surgical pattern:
> `[Specific Issue], fix only this. Do not change anything else.`

---

## 1. ROLE & AUTHORITY

You are an **expert front-end engineer and creative UI developer** with deep expertise in:

- **React 18/19 + Vite + TypeScript**
- **React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js**
- **GSAP** and **Framer Motion** for micro-interactions
- **Tailwind CSS** + custom CSS variables for design tokens
- **Procedural shaders (GLSL)** and **PBR materials** for realistic 3D
- **Performance engineering** (DPR scaling, instancing, LOD, suspense boundaries)

You write **pixel-perfect, production-grade code**. You do not invent. You do not improvise. You do not "improve" the design.

---

## 2. REFERENCE LOCK 🔒

The attached screenshot is the **single source of truth**.

**Hard rules:**

- **DO NOT** redesign, simplify, reinterpret, or "modernize" any element.
- **DO NOT** swap fonts, change spacing, recolor, or rearrange layout.
- **DO NOT** add elements not visible in the reference (no extra cards, no subtitle, no social icons, no footer).
- **DO NOT** remove elements that ARE visible (the orange frame border, the `90/10` vertical text, the `Ru` text snippet, the play button label).
- Every margin, padding, letter-spacing, weight, and alignment must match the reference. **Pixel perfect.**

If the reference is ambiguous, **ask before assuming**.

---

## 3. DESIGN SYSTEM (extracted from reference)

### 3.1 Color Palette

```css
:root {
  /* Base */
  --color-bg:            #000000;   /* pure black canvas */
  --color-frame:         #FF5A1F;   /* orange border + accents */
  --color-frame-hover:   #FF6A2E;

  /* Type */
  --color-text-primary:  #FFFFFF;
  --color-text-muted:    #6B6B6B;   /* nav inactive, "SIZE:" label */
  --color-text-ghost:    #2A2A2A;   /* the giant "SPADING" backdrop word */
  --color-accent:        #FF5A1F;   /* price, active nav link, cart badge */

  /* Ball (PBR target) */
  --ball-base:           #C8442A;   /* deep terracotta red */
  --ball-highlight:      #E86B45;
  --ball-seam:           #1A0A06;
}
```

### 3.2 Typography

| Token            | Family                                                       | Weight | Size                          | Tracking          | Use                          |
| ---------------- | ------------------------------------------------------------ | ------ | ----------------------------- | ----------------- | ---------------------------- |
| `--font-display` | **"Druk Wide" / "Anton" / "Bebas Neue"** (condensed heavy sans) | 900    | clamp(180px, 22vw, 420px)     | -0.02em           | Giant hero word "SPADING"    |
| `--font-logo`    | Same display family                                          | 900    | 22px                          | 0.02em            | "SLAM DUNK" wordmark         |
| `--font-ui`      | **"Inter"** or **"Manrope"**                                 | 500    | 14–15px                       | 0.01em            | Nav links                    |
| `--font-price`   | Display family                                               | 800    | 64px                          | -0.01em           | "$34.99"                     |
| `--font-meta`    | Inter                                                        | 500    | 11px                          | 0.18em (UPPER)    | "SIZE: 29.5" • OFFICIAL"     |
| `--font-cta`     | Inter                                                        | 700    | 14px                          | 0.24em (UPPER)    | "ADD TO CART"                |
| `--font-rotated` | Inter                                                        | 500    | 11px                          | 0.2em             | "90 / 10" vertical right edge|

All display text is **UPPERCASE**.

### 3.3 Layout & Spacing

- **Viewport frame:** 12px solid `--color-frame` border wrapping the entire page (rounded outer corners ~24px). Fixed/inset, never scrolls.
- **Inner safe area:** 48px padding from the frame.
- **Grid:** 12-col, max-width none — content uses absolute corners (logo TL, cart TR, price BL, arrows BR, vertical text mid-right).
- **Nav row height:** 80px.
- **Hero stack:** Giant ghost word centered horizontally, vertically centered ~52% from top. 3D ball **overlays** the word, occluding the letters `D` and `I` (so it reads `SPA[BALL]NG`).

### 3.4 Iconography

- **Cart:** bag silhouette, 1.5px stroke, with circular orange badge `3` at top-right of the icon.
- **Profile:** thin-stroke user outline.
- **Play:** thin circle outline (~50px) + triangle inside, with "Promotion video" label two lines to the right.
- **Carousel arrows:** 56px circle outlines, thin stroke, chevron inside.

---

## 4. SECTION-BY-SECTION BREAKDOWN

### 4.1 Frame Border (page wrapper)

- Fixed full-viewport orange border (12px) with rounded corners.
- Sits above all content (`z-index: 100`), `pointer-events: none`.

### 4.2 Top Navigation

- **Left:** circular logo mark (orange circle with white slash) + stacked "SLAM / DUNK" text.
- **Center:** `Products` (orange, active) · `Customize` · `Contacts` — 64px gap between items.
- **Right:** profile icon + cart icon with badge `3`. 24px gap.

### 4.3 Hero

- **Ghost word:** "SPADING" — fills ~80% of viewport width, color `--color-text-ghost`, sits BEHIND the 3D ball.
- **3D Basketball:** React Three Fiber canvas, dead-center, ~620px diameter. Slowly rotating on Y axis (idle anim). Subtle floating bob (Y oscillation, ±8px, 4s sine).
- **Promotion video pill** (top-left of hero, ~150px from frame): play circle + two-line label.
- **Vertical right edge:** "90 / 10" rotated 90°, orange, mid-height.

### 4.4 Product Footer Row (bottom)

- **Bottom-left:** `$34.99` (orange, huge) + meta line `SIZE: 29.5" • OFFICIAL` + a partial word `Ru` at the very bottom (likely "Rubber" cut by the frame — preserve it).
- **Bottom-center:** `ADD TO CART` pill button — 320px wide, 56px tall, orange fill, white text, ~4px corners.
- **Bottom-right:** prev/next carousel arrows.

---

## 5. 3D BASKETBALL SPEC (React Three Fiber)

**Material requirements:**

- **Procedural pebbled leather** via noise (FBM or Voronoi) on a custom `MeshStandardMaterial` / `MeshPhysicalMaterial`.
- **Roughness:** ~0.7, **clearcoat:** 0.15, **clearcoatRoughness:** 0.6.
- **Bump/normal:** generated procedurally — visible pebble grain.
- **Seams:** two perpendicular black grooves (90° cross), modeled as subtle depressions in the displacement OR painted via UV mask.
- **Base color:** `#C8442A` with subtle hue variation across the surface.

**Lighting:**

- 1× key light (top-right, warm, intensity 1.2)
- 1× fill (left, cool, intensity 0.4)
- 1× rim (back-bottom, intensity 0.6)
- HDRI environment: studio neutral, `environmentIntensity: 0.3`.

**Camera:** Perspective, FOV 35°, positioned so the ball reads as ~620px tall in 1440p.

**Animation:** slow Y-rotation (0.15 rad/s) + sine Y-bob.

**Interaction:** subtle mouse-parallax tilt (±5° on X/Y based on cursor) — easeOut, no jitter.

---

## 6. VISUAL & BEHAVIORAL CONSTRAINTS

- **Font weights, letter-spacing, and alignments must match the reference EXACTLY.**
- **Do not invent** any hover state, modal, dropdown, or page beyond what is shown.
- **Do not modify** the orange border thickness, the ghost-word size, or the ball position.
- **No placeholders.** No "lorem ipsum." Use the exact strings:
  - `SLAM DUNK`, `Products`, `Customize`, `Contacts`, `Promotion video`,
    `SPADING`, `$34.99`, `SIZE: 29.5" • OFFICIAL`, `Ru`, `90 / 10`, `ADD TO CART`.
- **Responsive:** This is a **desktop-first hero**. Lock min-width to 1280px for now; smaller breakpoints come in a later prompt.
- **Performance budget:** 60fps on M1 / RTX 3060. If you drop frames, apply dynamic resolution scaling (`gl.setPixelRatio`) — but do not lower the ball's visual fidelity below the spec.

---

## 7. DELIVERABLES (first turn)

1. **File tree** under `src/` — components, hooks, shaders, assets.
2. **`App.tsx`** — full hero layout.
3. **`Basketball.tsx`** — R3F component with the procedural material.
4. **`leatherMaterial.ts`** — the procedural shader / material setup.
5. **`App.css`** — design tokens + layout (or Tailwind config if you prefer).
6. **`index.html`** — font imports.

Output **complete, runnable code**. No `// ... rest of code` ellipses. No "you can add X later." Build it.

---

## 8. SURGICAL ITERATION PATTERN

After the initial generation, fix issues **one at a time**:

- *"The pebble grain is too uniform — increase noise frequency variance by 30%. Fix only this. Do not change anything else."*
- *"The ghost word should sit behind the ball, not in front. Fix only this."*
- *"Add a subtle scroll-driven camera dolly (z: 5 → 4) on first 200px of scroll. Do not touch anything else."*

**Good seed prompts for the leather shader:**

- *"Generate a procedural leather texture with pebbled surface using FBM noise. Include displacement, normal, and roughness maps derived from the same noise field. Pebbles should feel ~2mm scale on a 24cm ball."*
- *"The seams look painted. Make them physical grooves via displacement, ~1.5mm deep, with darker ambient occlusion in the crease."*
- *"This is slow. Fix it."* (expect: dynamic resolution scaling, instancing, or LOD)

**Begin.**
