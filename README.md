# Yaron Engineering PLC — Corporate Website & Knowledge Hub

Premium corporate website and editorial Knowledge Hub for **Yaron Engineering PLC** (Addis Ababa, Ethiopia): ICT infrastructure, cybersecurity, data center, cloud and enterprise technology systems integrator.

```
Next.js 15 (this repo root)  ──REST──▶  Spring Boot 3 / Java 21 (./backend)  ──JPA──▶  PostgreSQL 16
  public site + blog + admin CMS           articles · auth · media · search · scheduling     Flyway migrations
```

The frontend never touches the database; every content operation goes through the API documented in [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md). Editorial design decisions are in [`BLOG_DESIGN_SYSTEM.md`](./BLOG_DESIGN_SYSTEM.md).

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion and Lucide icons. Design decisions are documented in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL and (optionally) CONTACT_WEBHOOK_URL
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm run format`, `npm test` (Vitest).

### Full stack with Docker

```bash
cp .env.example .env.local
docker compose up --build        # frontend :3000 · API :8080 · PostgreSQL :5433
```

Default admin credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (compose defaults: `admin@yaronengineering.com` / `ChangeMe123!` — change them). With `SEED_SAMPLE_CONTENT=true` the API inserts five clearly labelled sample articles on first start.

### Backend without Docker

See [`backend/README.md`](./backend/README.md): create the `yaron_blog` database on your local PostgreSQL, export the env vars, then `mvn spring-boot:run`. Run the frontend with `API_URL=http://localhost:8080 npm run dev`.

Requires Node 18.18+ (tested on Node 18.19 and the Next 15.5 line). Upgrading to Next 16 requires Node 20.9+.

## Knowledge Hub (blog + CMS)

| Area         | Where                                                                                                                           | Notes                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public blog  | `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/blog/author/[slug]`, `/blog/search?q=`, `/blog/rss.xml` | Server components; data cached and tagged, revalidated by the backend on publish                                                                   |
| Admin CMS    | `/admin` (login at `/admin/login`)                                                                                              | Dashboard, articles (Tiptap editor, autosave every 45 s, preview, publish, schedule, archive, feature), categories, tags, authors, media, settings |
| Auth         | `app/api/auth/*` + `middleware.ts`                                                                                              | Backend JWT stored in an httpOnly cookie; `/api/admin/*` proxies to the API with the token, so it never reaches browser JS                         |
| Revalidation | `app/api/revalidate`                                                                                                            | Backend POSTs `{ secret, tags }` after editorial actions                                                                                           |
| Data layer   | `lib/blog/api.ts` (public, server-only), `lib/admin/client.ts` (browser → proxy)                                                | Types in `lib/blog/types.ts`                                                                                                                       |

Roles: **ADMIN** (everything), **EDITOR** (create/edit/publish/manage content), **AUTHOR** (own drafts only). Drafts are never exposed by public endpoints; previews are authenticated.

## Project structure

```
backend/             Spring Boot API (see backend/README.md)
app/                 Routes (App Router). Corporate pages are statically generated; blog pages are cached server renders.
  layout.tsx         Fonts, header/footer, cursor, Organization JSON-LD
  page.tsx           Home
  about/ services/ services/[slug]/ solutions/ industries/ projects/
  partners/ careers/ contact/ privacy/ terms/
  blog/              Knowledge Hub public pages
  admin/             CMS (login + (cms) route group with the admin shell)
  api/contact/       Contact form endpoint (validates, forwards to CONTACT_WEBHOOK_URL)
  api/auth/ api/admin/ api/revalidate/ api/newsletter/ api/blog/view/   Blog integration routes
  sitemap.ts robots.ts opengraph-image.tsx icon.png apple-icon.png
components/
  ui/                Button, Section, Container, SectionHeader, Eyebrow, Logo, Backdrop, Tag, Placeholder
  animations/        Reveal, Stagger, TextReveal, ClipReveal, Counter, ParallaxImage, MagneticButton, MotionProvider
  navigation/        Header, ServicesPanel (desktop mega panel), MobileMenu
  hero/              HomeHero, PageHero, NetworkLines
  sections/          Home page sections (Credibility, AboutIntro, ServicesShowcase, SolutionsProcess, …)
  cards/             IndustryCard, ProjectCard, PartnerSlot
  forms/             ContactForm
  blog/              Editorial components (FeaturedArticle, ArticleRow, ArticleRenderer, TableOfContents, ShareRail, …)
  admin/             CMS components (AdminShell, ArticleForm, editor/ (Tiptap), ArticlesTable, MediaLibrary, …)
  layout/            Footer, CustomCursor, SkipLink, JsonLd, LegalPage
lib/
  data/              ALL content: company, services, industries, solutions, projects, partners, why, careers, navigation
  utils/             cn, motion (variants/easing), seo (metadata + schema builders), site (URL helpers)
public/images/       brand/ (official logo)  photos/ (art-directed photography, credited in CREDITS.md)
```

Content never lives in JSX: edit `lib/data/*.ts` to change copy, services, industries, projects or partners.

## Updating content & assets

| What                                          | Where                                                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Company facts, contact details, vision, story | `lib/data/company.ts`                                                                                                       |
| Services (7) and their detail pages           | `lib/data/services.ts` — each entry becomes `/services/<slug>`                                                              |
| Industries                                    | `lib/data/industries.ts`                                                                                                    |
| Projects                                      | `lib/data/projects.ts` — add `result` only once verified with the client                                                    |
| Partner logos                                 | `lib/data/partners.ts` — set `logo: "/images/partners/<file>.svg"`; the grid switches from wordmarks to logos automatically |
| Open roles                                    | `lib/data/careers.ts` → `openRoles`                                                                                         |
| Social links                                  | `company.social` (hidden while empty)                                                                                       |
| Logo                                          | replace `public/images/brand/yaron-logo.png` (and `app/icon.png`, `app/apple-icon.png`)                                     |
| Photography                                   | drop replacements with the same filenames in `public/images/photos`                                                         |

### Placeholders awaiting official information

- Project outcomes / metrics (`[Verified outcome]` on each project card)
- Team portraits and leadership profiles (deliberately not generated)
- Social media links

Everything else (address, phones, emails, clients, partners, counts) comes from the company's published information.

## Contact form → CMS inbox

`POST /api/contact` validates the submission, drops honeypot hits, and stores the message in the API (`POST /api/v1/public/contact`, rate limited per IP). Managers review it at **/admin/messages**: unread badge in the sidebar and page title, a toast when new messages arrive (the CMS polls every 45 s), optional desktop notifications ("Enable desktop alerts" in the sidebar), split-view reading, reply by email with a pre-filled draft, mark read/unread/replied, archive, internal notes, and delete (admin only). The dashboard shows the unread count and the five latest messages. If `CONTACT_WEBHOOK_URL` is set, a copy is also forwarded there.

## Production considerations

- Set a strong `JWT_SECRET`, `REVALIDATE_SECRET` and admin password; serve both apps over HTTPS and set `CORS_ALLOWED_ORIGINS` to the site origin.
- Point `MEDIA_PUBLIC_BASE_URL` at the API's public host and add that hostname as `MEDIA_HOSTNAME` for `next/image`.
- Media is stored on the API's filesystem (`MEDIA_STORAGE_PATH`, a Docker volume in compose). Swap `LocalStorageService` for an S3-compatible implementation when moving to object storage.
- The publishing scheduler is a single-instance `@Scheduled` job; add a distributed lock (e.g. ShedLock) before running multiple API replicas.
- Back up PostgreSQL and the media volume together.

## Quality checks performed

- `npm run lint`, `npm run typecheck`, `npm run build` — clean.
- Lighthouse (production build, Lighthouse 12): home desktop 100 / 100 / 100 / 100 (performance / accessibility / best practices / SEO); home mobile 90 / 100 / 100 / 100; services mobile 93 / 100 / 100 / 100.
- Verified visually at 390 px and 1440 px; no horizontal overflow on any route; no console errors.
- Reduced motion: all reveals collapse to instant opacity changes; parallax, loops and the custom cursor are disabled.
