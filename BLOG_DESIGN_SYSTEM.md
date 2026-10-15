# Yaron Engineering Knowledge Hub — Blog Design System

Extends `DESIGN_SYSTEM.md`. Same tokens, same fonts, same brand blue. This document covers only what the editorial surface and the admin CMS add.

## 1. Editorial principles

| Principle             | In practice                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Publication, not blog | One dominant featured story, rows and asymmetric grids instead of uniform cards, hairline rules, numbered metadata.                  |
| Reading first         | Article body capped at 740px, 19–20px body on desktop, 1.8 line-height, generous paragraph rhythm; nothing animates inside the body. |
| Technical texture     | Mono uppercase metadata (category · date · reading time), thin rules, small arrows.                                                  |
| Same brand            | Brand blue only for category labels, active states, reading progress, links and the single primary CTA per screen.                   |

## 2. Typography (editorial scale)

| Role                       | Size                                              | Weight | Notes                                  |
| -------------------------- | ------------------------------------------------- | ------ | -------------------------------------- |
| Blog hero / featured title | `text-h1` (40→72px)                               | 600    | balanced, ≤ 18ch                       |
| Article title (h1)         | clamp(2.25rem, 1.4rem + 3.2vw, 3.75rem)           | 600    | −0.03em                                |
| Article h2                 | 1.75rem → 2rem                                    | 600    | 3rem top margin, 1rem bottom           |
| Article h3                 | 1.3rem → 1.45rem                                  | 600    |                                        |
| Article body               | 1.1875rem (19px) desktop, 1.0625rem (17px) mobile | 400    | `line-height: 1.8`, `max-width: 740px` |
| Lead / excerpt             | `text-lead`                                       | 400    | muted                                  |
| Metadata                   | mono 0.68–0.72rem uppercase, 0.14em tracking      | 500    |                                        |
| Caption                    | 0.875rem muted, centered                          |        |                                        |

Article prose styles live in `app/globals.css` under `.prose-article` (blockquote with brand rule, callouts, tables with hairlines, code blocks on ink-900, figure captions, links with underline offset).

## 3. Layout & grid

- Blog hero: 12-col, image 7 / text 5 on lg; stacked image-first on mobile.
- Latest insights: editorial rows (image 4 / text 8) with hairline separators; on mobile the row becomes image-over-text.
- Category pages: masthead (name + tagline + count) → featured → rows → "Related categories" chip rail.
- Article page: `grid-cols-[1fr_minmax(0,740px)_1fr]` on xl — left rail = sticky share, centre = body, right rail = sticky table of contents. On < xl the TOC collapses into an "On this page" disclosure above the body and share controls move to a horizontal row under the title.
- Admin: fixed 256px sidebar (collapsible to icons on md, drawer on mobile) + content column max 1280px; neutral light surface, no imagery, dense 14px UI type.

## 4. Components

| Component                                                                                                                                                                   | Purpose                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `FeaturedArticle`                                                                                                                                                           | Hero story: image with clip reveal, category, title, excerpt, byline, CTA                     |
| `ArticleRow`                                                                                                                                                                | Editorial list item (image + text + arrow); hover: image 1.03, arrow x+4px, accent rule grows |
| `ArticleCard`                                                                                                                                                               | Compact asymmetric card for grids (related, category secondary lists)                         |
| `CategoryNav`                                                                                                                                                               | Horizontal scroll rail of categories with active state; backend-driven                        |
| `ArticleRenderer`                                                                                                                                                           | Sanitized HTML → `.prose-article`; nothing client-side                                        |
| `TableOfContents`                                                                                                                                                           | Built from `toc`; IntersectionObserver highlights current heading                             |
| `ReadingProgress`                                                                                                                                                           | 2px brand bar fixed under the header                                                          |
| `ShareRail`                                                                                                                                                                 | LinkedIn, Facebook, X, WhatsApp, copy link; vertical on xl, horizontal otherwise              |
| `AuthorCard`                                                                                                                                                                | Author avatar/initials, position, bio, LinkedIn                                               |
| `NewsletterCTA`                                                                                                                                                             | Posts to `/api/v1/public/newsletter/subscribe`                                                |
| `SearchForm`                                                                                                                                                                | Large field; submits to `/blog/search?q=`                                                     |
| `BlogSkeletons`                                                                                                                                                             | Layout-matched skeletons for hero, rows, article                                              |
| `EmptyState`                                                                                                                                                                | Search no results, empty category, API unavailable                                            |
| Admin: `AdminShell`, `DataTable`, `StatusBadge`, `ArticleEditor` (Tiptap), `EditorToolbar`, `SeoPanel`, `PublishPanel`, `MediaPicker`, `ConfirmDialog`, `Toast`, `StatTile` |                                                                                               |

## 5. Motion

Reveal, Stagger and ClipReveal from the corporate site; durations 0.45–0.8s. Page transitions: a 250ms fade on route change for blog routes only (template). Article body: none. Admin: 150ms micro-transitions only.

## 6. Breakpoints verified

320, 375, 390, 430, 768, 1024, 1280, 1440, 1920.

## 7. Accessibility

Landmarks per page, single h1, `aria-current` in category nav, skip link, TOC links with focus rings, share buttons with visible labels on hover and `aria-label`, editor toolbar as `role="toolbar"` with `aria-pressed`, form fields with labels and `aria-describedby` errors, 4.5:1 contrast, reduced motion honoured.
