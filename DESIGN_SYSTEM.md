# Yaron Engineering PLC — Design System

Version 1.0 · Addis Ababa, Ethiopia · Built on Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion.

The system exists to make Yaron Engineering read, in five seconds, as a **global‑grade technology infrastructure company**: trust, engineering depth, security, scale. Every token below serves that reading. Nothing here is decorative.

---

## 1. Brand position & visual philosophy

| Principle   | What it means in the UI                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Blue first  | The company colour is the logo's royal / light blue. Dark sections are **blue**, never navy or blue‑black; photos are re‑coloured to match.   |
| Cinematic   | Heroes are pure brand colour: gradient mesh, drifting blooms, orbit ornament and circuit lines — no photography. Photos live inside sections. |
| Editorial   | Asymmetric two‑column compositions, large statement typography, numbered items, generous whitespace.                                          |
| Technical   | Small uppercase labels, fine grid lines, coordinates/IDs as texture.                                                                          |
| Trustworthy | High contrast, honest content, placeholders clearly marked. No fabricated clients, metrics or people.                                         |

Mood references (quality bar only, never copied): Cisco, Palo Alto Networks, Equinix, Cloudflare, Siemens, Accenture.

---

## 2. Colour system

Two colours only, both taken from the Yaron shield logo: **blue** (primary, logo fill ≈ `#3060C0`–`#4888D8`) and **gold** (secondary, logo circuit ≈ `#F5C518`). There is no black and no navy: the darkest value on the site is the saturated royal blue `ink-950`, and every neutral is a tint of that blue.

> **Revision 2026‑10‑20.** The owner reported that the site read as blue‑black. Two causes: the `ink` scale bottomed out at navy (`#0E2250` → `#0D2D6E`) and dark stock photography was covered with navy‑to‑black gradients. Both are gone: `ink-950` is now `#1540A6`, overlays are blue, and every photo inside a dark section goes through the **blue duotone** recipe below.

### Palette tokens (`app/globals.css` → `@theme`)

| Token       | Hex       | Role                                                                |
| ----------- | --------- | ------------------------------------------------------------------- |
| `ink-950`   | `#1540A6` | Dark section background (hero, services, why, CTA, footer)          |
| `ink-900`   | `#1B49B4` | Dark soft‑tone background, dark surface                             |
| `ink-850`   | `#2152BF` | Dark elevated surface                                               |
| `ink-800`   | `#2A5EC9` | Dark borders                                                        |
| `ink-700`   | `#3369D1` | Dark borders (strong)                                               |
| `ink-600`   | `#3F76D6` | Disabled on dark                                                    |
| `ink-500`   | `#6A97E0` | Hover borders on dark                                               |
| `ink-400`   | `#9DBDEE` | Labels / meta on dark (4.7:1 on `ink-950`)                          |
| `ink-300`   | `#BCD2F3` | Secondary text on dark (6:1)                                        |
| `ink-200`   | `#D6E4F9` | Body text on dark (6.9:1), light borders (strong)                   |
| `ink-100`   | `#E9F1FC` | Light borders (subtle)                                              |
| `ink-50`    | `#F3F7FD` | Lightest tint (inputs, pills)                                       |
| `white`     | `#FFFFFF` | Cards and surfaces on light sections — never a whole section        |
| `brand-300` | `#A6CCF7` | Brand text on dark, links on dark                                   |
| `brand-400` | `#6CA6EE` | Hover on dark, glows                                                |
| `brand-500` | `#3F82DC` | **Primary**. Active states, links, AI chat, admin                   |
| `brand-600` | `#2F6FCF` | Hover on light                                                      |
| `brand-700` | `#2560C4` | Link / emphasis text on light (5.9:1)                               |
| `gold-300`  | `#FFE98A` | Gold shimmer / soft glow                                            |
| `gold-400`  | `#FBD84A` | **Secondary on dark**: headline emphasis words, stat numerals       |
| `gold-500`  | `#F5C518` | **Secondary**. Primary buttons, eyebrow rules, nav underline, focus |
| `gold-600`  | `#D9A90C` | Gold hover                                                          |
| `gold-700`  | `#B08808` | Gold on light surfaces (pills, rules)                               |

Light sections are a soft blue tint, not white: `--background #EAF1FC` (soft tone `#E0EAFA`) with a light‑blue radial wash in one corner (`globals.css`), white `--surface` cards, `--border #CFDDF3`. Text: `--foreground #143A8C` (9.2:1 on the tint), `--muted-foreground #41619F` (5.4:1), `brand-700` links (5.2:1).

Red (`red-500/600`) is reserved for validation errors and destructive admin actions; it is a status signal, not part of the palette.

### Semantic tokens (CSS variables, theme‑switchable per section)

```
--background   --foreground   --muted   --muted-foreground
--border       --border-strong   --surface   --surface-elevated
--brand        --brand-hover   --brand-foreground   --brand-text
--accent       --accent-hover  --accent-foreground  --accent-text
```

`--accent*` is gold (`bg-accent`, `text-accent-text`); `--brand*` is blue.

Sections carry `data-theme="dark" | "light"`. Components only use semantic utilities (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-surface`) so the same component works on either theme.

### Blue duotone imagery (`duotone-*` utilities)

Every photograph or video that sits inside a dark section is re‑coloured so it cannot pull the page towards black:

1. the media element gets `duotone-media` (`grayscale(1) contrast(1.05)`);
2. a `duotone-shadows` layer (`ink-950`, `mix-blend-mode: lighten`) lifts every shadow to royal blue;
3. a `duotone-lights` layer (`#9CC6F5`, `mix-blend-mode: multiply`) pulls highlights down to the logo's light blue;
4. an optional `image-overlay` / `from-ink-950` gradient protects text.

`ParallaxImage` exposes this as the `duotone` prop; `HeroVideo`, `PageHero`, `FinalCTA`, `IndustryCard`, `HeroPanel` and the service cards place the layers directly. Photos in **light** sections keep their natural colour.

### Usage rules

1. Blue is the whole stage: dark sections use the royal `ink` scale as their background, light sections use white / `ink-50`. Nothing on the site is darker than `ink-950`.
2. Gold is the signal colour and the **primary button**: gold fill with `#143A8C` text (5.6:1) so the call to action pops on both blue and white. It also marks eyebrow rules, the active‑nav underline, the emphasis word in every page‑hero headline, stat numerals, footer headings, icons, live dots, focus rings and text selection. Never gold body text.
3. Dark sections dominate the narrative (hero → services → industries → expertise → why → CTA); light sections provide breathing room (about, process, projects, partners, commitment).
4. Gradients: only `ink-950`‑to‑transparent overlays on duotoned photography, and one radial `brand-400` glow per dark section.
5. Contrast: body text ≥ 4.5:1, large text ≥ 3:1 on both themes. `white` on `ink-950` ≈ 9:1; `ink-300` on `ink-950` ≈ 6:1; `gold-400` on `ink-950` ≈ 6.5:1; `brand-700` on white ≈ 5.9:1.

---

## 3. Typography

Two families with two clear jobs, both self‑hosted through `next/font/google`:

- **Sora** (`--font-display`, `--font-label`) — every headline, stat numeral, button, navigation item, logo wordmark and small uppercase label. Geometric and confident; it is what makes the site look like a technology company rather than a brochure.
- **Plus Jakarta Sans** (`--font-sans`) — body copy, leads, forms and UI text. Open and friendly at small sizes.
- **Geist Mono** is kept only for code inside articles and CMS slugs/IDs. It is no longer used for site labels.

`h1`–`h4` pick up Sora 700 from the base layer; the `eyebrow` and `label` utilities pick up Sora 600 with `+0.14–0.16em` tracking, so labels are uniform across every component instead of ad‑hoc mono sizes.

| Style           | Size (mobile → desktop) | Family / weight | Tracking          | Leading |
| --------------- | ----------------------- | --------------- | ----------------- | ------- |
| Display (hero)  | 44px → 96px (`clamp`)   | Sora 700        | −0.03em           | 1.0     |
| H1 (every hero) | 38px → 64px             | Sora 700        | −0.025em          | 1.04    |
| H2 (section)    | 30px → 48px             | Sora 700        | −0.02em           | 1.08    |
| H3              | 24px → 32px             | Sora 600–700    | −0.015em          | 1.18    |
| H4              | 18px → 20px             | Sora 600        | −0.01em           | 1.3     |
| Lead            | 18px → 22px             | Jakarta 400     | 0                 | 1.5     | (hero intros and section headers only)
| Body            | 16px, fixed             | Jakarta 400     | 0                 | 1.6     | (every other sentence: paragraphs, bullets, details, tags, footer, forms)
| Button / nav    | 15–16px                 | Sora 500–600    | +0.01em           | 1       |
| Eyebrow / label | 11–12px                 | Sora 600        | +0.14em uppercase | 1       |
| Stat numerals   | 64px → 120px            | Sora 700        | −0.03em           | 1       |

Rules: one size per level — `text-h1` for every hero and the closing CTA, `text-h2` for every section heading, `text-body` (a fixed 16px) for **all** running text — there is no small text size on the public site, the owner asked for one body size (2026‑10‑20) — and a single label size `text-[0.7rem]` / `tracking-[0.14em]` for all uppercase labels. Reading width ≤ 65ch; emphasise single words in headings with `text-gold-400` (on dark) or `text-brand-text` (on light), not italics; never introduce a third family.

---

## 4. Spacing, layout & radius

- **Base unit** 4px. Section rhythm: `py-20 md:py-24 xl:py-28` (tightened 2026‑10‑20 so pages scroll like a corporate site, not a landing page). Heroes are compact: no `min-h-screen`.
- **Container** `max-w-[1440px]` with gutters `px-5 sm:px-8 lg:px-12 xl:px-16`. A `narrow` variant at `max-w-[1120px]` for reading sections.
- **Grid** 12 columns desktop; editorial sections split 5/7 or 4/8, never 6/6 for text‑and‑image.
- **Radius** `--radius-sm 6px`, `--radius-md 10px`, `--radius-lg 16px`. Buttons 6px. Images 10–16px. No pill buttons, no fully rounded cards.
- **Borders** 1px, semantic. Hairline dividers (`border-border`) are the primary structuring device instead of card boxes.
- **Shadows** almost none on dark. On light: `shadow-[0_1px_0_rgba(11,26,61,.04),0_24px_48px_-24px_rgba(11,26,61,.18)]` for hovered media only.

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

| Section        | Image                                                                                                                   | Treatment                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Home hero      | none — `hero-mesh` gradient + `hero-blob` blooms + `HeroOrbits` + `NetworkLines`                                        | No photography (owner request, 2026‑10‑20) |
| Page heroes    | none — same brand composition, smaller orbits                                                                           | `PageHero` has no image prop               |
| About          | `team-screens` (engineers at screens) + `rack-mono`                                                                     | Clip‑path reveal, subtle parallax          |
| Services panel | one per service: `network-patch`, `dc-corridor`, `boardroom`, `soc-analyst`, `cloud-nodes`, `server-hands`, `cctv-wall` | Crossfade on hover/focus                   |
| Process        | `drafting`, `whiteboard`                                                                                                | Low‑key, cropped tight                     |
| Industries     | `parliament`, `financial-district`, `towers-glass`, `hospital`, `ngo`, `open-office`, `university`, `powerlines`        | Desaturated 20 %, brightens on hover       |
| Projects       | `network-switch`, `rack-mono`, `code-hands`, `earth-night`                                                              | Monochrome‑leaning                         |
| Expertise      | `engineer-lab`, `workspace-mono`                                                                                        | Editorial                                  |
| Final CTA      | `earth-night`                                                                                                           | Heavy dark overlay                         |

Overlay recipe for dark imagery: the blue duotone (§2) plus `linear-gradient(to top, ink-950 0%, ink-950/60 40%, ink-950/15 100%)` and a side vignette. Images are served through `next/image` with explicit `sizes`, `priority` only on the hero.

---

## 9. Accessibility & performance commitments

- Semantic landmarks, one `h1` per page, logical heading order, skip link, visible focus (`ring-2 ring-brand-500 ring-offset-2`), ≥ 4.5:1 contrast, `aria-current` on active nav, form labels + error messaging, reduced‑motion support.
- Server Components by default; client components only for header, menu, animations, cursor, form, interactive showcases. Hero image `priority`, everything else lazy. Fonts self‑hosted via `next/font`. No third‑party scripts.
