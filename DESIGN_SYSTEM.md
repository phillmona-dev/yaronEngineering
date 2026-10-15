# Yaron Engineering PLC — Design System

Version 1.0 · Addis Ababa, Ethiopia · Built on Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion.

The system exists to make Yaron Engineering read, in five seconds, as a **global‑grade technology infrastructure company**: trust, engineering depth, security, scale. Every token below serves that reading. Nothing here is decorative.

---

## 1. Brand position & visual philosophy

| Principle   | What it means in the UI                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| Cinematic   | Dark, image‑led hero and climax sections; controlled gradients; low‑opacity technical line work.                           |
| Editorial   | Asymmetric two‑column compositions, large statement typography, numbered items, generous whitespace.                       |
| Technical   | Small uppercase mono metadata, fine grid lines, coordinates/IDs as texture.                                                |
| Restrained  | Brand blue is an _accent_, never a background fill for whole sections. Gold appears only in the logo and one micro‑signal. |
| Trustworthy | High contrast, honest content, placeholders clearly marked. No fabricated clients, metrics or people.                      |

Mood references (quality bar only, never copied): Cisco, Palo Alto Networks, Equinix, Cloudflare, Siemens, Accenture.

---

## 2. Colour system

Primary brand colour is extracted from the Yaron shield logo (royal blue ≈ `#3060C0`), supported by a cool near‑black foundation.

### Palette tokens (`app/globals.css` → `@theme`)

| Token       | Hex       | Role                                              |
| ----------- | --------- | ------------------------------------------------- |
| `ink-950`   | `#05070C` | Deepest page background (hero, final CTA)         |
| `ink-900`   | `#0A0D14` | Dark section background                           |
| `ink-850`   | `#0E1219` | Dark surface                                      |
| `ink-800`   | `#141922` | Dark elevated surface / hover                     |
| `ink-700`   | `#1C2230` | Dark borders (strong)                             |
| `ink-600`   | `#2A3242` | Dark borders (subtle), disabled                   |
| `ink-500`   | `#4A5468` | Muted text on dark                                |
| `ink-400`   | `#6E7A91` | Muted text (light), icons                         |
| `ink-300`   | `#9AA4B8` | Secondary text on dark                            |
| `ink-200`   | `#C5CCD9` | Light borders (strong)                            |
| `ink-100`   | `#E6E9EF` | Light borders (subtle)                            |
| `ink-50`    | `#F3F5F8` | Off‑white section background                      |
| `white`     | `#FFFFFF` | Light page background                             |
| `brand-300` | `#8FB4F2` | Brand text on dark, links on dark                 |
| `brand-400` | `#5B8BE6` | Hover on dark, glows                              |
| `brand-500` | `#2F62C6` | **Primary brand**. CTAs, active nav, accent lines |
| `brand-600` | `#2650A6` | CTA hover on light                                |
| `brand-700` | `#1E4088` | Pressed / deep accents                            |
| `gold-500`  | `#E9B917` | Logo accent only; one live‑signal dot             |

### Semantic tokens (CSS variables, theme‑switchable per section)

```
--background   --foreground   --muted   --muted-foreground
--border       --border-strong   --surface   --surface-elevated
--brand        --brand-hover   --brand-foreground   --ring
```

Sections carry `data-theme="dark" | "light"`. Components only use semantic utilities (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-surface`) so the same component works on either theme.

### Usage rules

1. Brand blue is used for: CTAs, active nav indicator, accent rules, hover borders, counters, key emphasis words, focus rings. Never as a section background.
2. Dark sections dominate the narrative (hero → services → industries → expertise → why → CTA); light sections provide breathing room (about, process, projects, partners, commitment).
3. Gradients: only dark‑to‑transparent overlays on photography, and one radial brand glow per dark section at ≤ 18 % opacity.
4. Contrast: body text ≥ 4.5:1, large text ≥ 3:1 on both themes. `ink-300` on `ink-950` = 7.9:1; `ink-400` on white = 4.6:1.

---

## 3. Typography

One family: **Manrope** (variable, via `next/font/google`). One technical companion: **Geist Mono** for metadata only.

| Style          | Size (mobile → desktop) | Weight     | Tracking          | Leading |
| -------------- | ----------------------- | ---------- | ----------------- | ------- |
| Display (hero) | 44px → 96px (`clamp`)   | 600        | −0.035em          | 0.98    |
| H1 (page hero) | 40px → 72px             | 600        | −0.03em           | 1.02    |
| H2 (section)   | 32px → 56px             | 600        | −0.025em          | 1.05    |
| H3             | 24px → 32px             | 600        | −0.02em           | 1.15    |
| H4             | 18px → 20px             | 600        | −0.01em           | 1.3     |
| Lead           | 18px → 22px             | 400        | 0                 | 1.5     |
| Body           | 16px → 17px             | 400        | 0                 | 1.65    |
| Small          | 14px                    | 400        | 0                 | 1.5     |
| Eyebrow / meta | 11–12px                 | 500 (mono) | +0.14em uppercase | 1       |
| Stat numerals  | 64px → 120px            | 500        | −0.04em           | 0.9     |

Rules: reading width ≤ 65ch; headings never fully bold (700) — 600 reads more premium at scale; emphasise single words in headings with `text-brand-500`/`brand-300` not italics.

---

## 4. Spacing, layout & radius

- **Base unit** 4px. Section rhythm: `py-24 md:py-32 xl:py-40`.
- **Container** `max-w-[1440px]` with gutters `px-5 sm:px-8 lg:px-12 xl:px-16`. A `narrow` variant at `max-w-[1120px]` for reading sections.
- **Grid** 12 columns desktop; editorial sections split 5/7 or 4/8, never 6/6 for text‑and‑image.
- **Radius** `--radius-sm 6px`, `--radius-md 10px`, `--radius-lg 16px`. Buttons 6px. Images 10–16px. No pill buttons, no fully rounded cards.
- **Borders** 1px, semantic. Hairline dividers (`border-border`) are the primary structuring device instead of card boxes.
- **Shadows** almost none on dark. On light: `shadow-[0_1px_0_rgba(10,13,20,.04),0_24px_48px_-24px_rgba(10,13,20,.18)]` for hovered media only.

---

## 5. Component inventory

| Component                                                                       | Location                | Notes                                                                                                                                                            |
| ------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                        | `components/ui`         | `primary` / `secondary` / `ghost`, optional arrow with hover shift, magnetic wrapper opt‑in                                                                      |
| `Container`, `Section`, `SectionHeader`, `Eyebrow`                              | `components/ui`         | Structural primitives; `Section` sets `data-theme`                                                                                                               |
| `Logo`, `LogoMark`                                                              | `components/ui`         | Real shield mark (`/images/brand/yaron-logo.png`) + typographic wordmark; swap‑in point for an official SVG                                                      |
| `GridLines`, `Glow`                                                             | `components/ui`         | Low‑opacity background systems                                                                                                                                   |
| `Reveal`, `Stagger`, `TextReveal`, `Counter`, `ParallaxImage`, `MagneticButton` | `components/animations` | Framer Motion; all honour `prefers-reduced-motion`                                                                                                               |
| `Header`, `DesktopNav`, `MobileMenu`                                            | `components/navigation` | Transparent over hero → blurred bar on scroll; full‑screen mobile menu                                                                                           |
| `HomeHero`, `PageHero`                                                          | `components/hero`       | Cinematic image + overlay + network lines                                                                                                                        |
| Home sections                                                                   | `components/sections`   | Credibility, AboutIntro, ServicesShowcase, SolutionsProcess, IndustriesGrid, ProjectsShowcase, ExpertiseSection, PartnersSection, WhyYaron, Commitment, FinalCTA |
| `ServiceCard`, `IndustryCard`, `ProjectCard`, `PartnerSlot`                     | `components/cards`      | Data‑driven from `lib/data`                                                                                                                                      |
| `ContactForm`                                                                   | `components/forms`      | Client component; posts to `/api/contact`                                                                                                                        |
| `Footer`, `CustomCursor`                                                        | `components/layout`     | Cursor is desktop/fine‑pointer only                                                                                                                              |

All copy, services, industries, projects and partners live in `lib/data/*.ts`. JSX never hard‑codes repeated content.

---

## 6. Animation principles

- Engine: Framer Motion. Global `MotionConfig reducedMotion="user"`.
- **Easing** `[0.22, 1, 0.36, 1]` (expo‑out). Springs only for magnetic buttons and the mobile menu.
- **Durations** 0.45–0.8s for reveals, 0.2–0.3s for hovers, counters 1.6s.
- **Vocabulary** fade‑up (16–24px), clip‑path image reveal, line‑by‑line text reveal, staggered children (60–80ms), parallax ≤ 8 %, counters on viewport entry (once).
- **Hierarchy** only the first element of a section animates with a visible delay; children stagger. Decorative layers (network lines, glow) loop slowly (12–30s) at low opacity.
- **Reduced motion** reveals become instant opacity changes, parallax and loops are disabled, counters show final values.
- Never scroll‑hijack. Native scroll only. Sticky is used for the Solutions process rail and the service image panel on desktop only.

---

## 7. Responsive strategy

Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Design is checked at 360, 390, 768, 1024, 1280, 1440, 1920 and 2560.

- Mobile is composed, not stacked: service list becomes an accordion‑style list with inline image; industries become a 2‑column grid with image‑on‑tap‑less static treatment; the process rail becomes a vertical timeline; the hero stat strip becomes a 2×2 grid.
- Typography uses `clamp()` so 4K does not become a wall of text; the container caps at 1440px with the hero image bleeding full‑width.
- Touch targets ≥ 44px. Hover‑only information is always also visible on touch devices.

---

## 8. Imagery & art direction

Source: Unsplash (licence permits commercial use). Every image is dark, architectural or technical, no handshakes, no stock smiles, no holograms. Files live in `public/images/photos` and are credited in `public/images/CREDITS.md`.

| Section        | Image                                                                                                                   | Treatment                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Home hero      | `hero-datacenter` (cabled server racks)                                                                                 | Slow 1.0→1.06 scale, dark gradient, network lines, brand glow |
| About          | `team-screens` (engineers at screens) + `rack-mono`                                                                     | Clip‑path reveal, subtle parallax                             |
| Services panel | one per service: `network-patch`, `dc-corridor`, `boardroom`, `soc-analyst`, `cloud-nodes`, `server-hands`, `cctv-wall` | Crossfade on hover/focus                                      |
| Process        | `drafting`, `whiteboard`                                                                                                | Low‑key, cropped tight                                        |
| Industries     | `parliament`, `financial-district`, `towers-glass`, `hospital`, `ngo`, `open-office`, `university`, `powerlines`        | Desaturated 20 %, brightens on hover                          |
| Projects       | `network-switch`, `rack-mono`, `code-hands`, `earth-night`                                                              | Monochrome‑leaning                                            |
| Expertise      | `engineer-lab`, `workspace-mono`                                                                                        | Editorial                                                     |
| Final CTA      | `earth-night`                                                                                                           | Heavy dark overlay                                            |
| Contact        | `towers-glass`                                                                                                          | Page hero                                                     |

Overlay recipe for dark imagery: `linear-gradient(to top, ink-950 0%, ink-950/70 40%, ink-950/20 100%)` plus a side vignette. Images are served through `next/image` with explicit `sizes`, `priority` only on the hero.

---

## 9. Accessibility & performance commitments

- Semantic landmarks, one `h1` per page, logical heading order, skip link, visible focus (`ring-2 ring-brand-500 ring-offset-2`), ≥ 4.5:1 contrast, `aria-current` on active nav, form labels + error messaging, reduced‑motion support.
- Server Components by default; client components only for header, menu, animations, cursor, form, interactive showcases. Hero image `priority`, everything else lazy. Fonts self‑hosted via `next/font`. No third‑party scripts.
