# Yaron Engineering Knowledge Hub — API Documentation

Backend: Spring Boot 3.x · Java 21 · PostgreSQL 16 · Flyway. Base path **`/api/v1`**. All bodies are JSON (UTF-8) except media upload (multipart).

Two surfaces:

| Surface | Prefix                         | Auth                          | Exposes                    |
| ------- | ------------------------------ | ----------------------------- | -------------------------- |
| Public  | `/api/v1/public/**`            | none                          | **Published** content only |
| Admin   | `/api/v1/**` (everything else) | `Authorization: Bearer <JWT>` | Full content management    |

Static media files are served from **`/media/files/{filename}`** (public, immutable cache).

---

## 1. Authentication

JWT bearer tokens (HS256, `JWT_SECRET`, default TTL 12 h). Passwords are BCrypt-hashed. Tokens are never logged.

| Method | Path                    | Body                                   | Response                                                                                                                                                                                                                                                                |
| ------ | ----------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/login`           | `{ "email", "password" }`              | `200 { "accessToken", "tokenType": "Bearer", "expiresIn": 43200, "user": User }` · `401 INVALID_CREDENTIALS`                                                                                                                                                            |
| GET    | `/auth/me`              | —                                      | `200 User`                                                                                                                                                                                                                                                              |
| GET    | `/auth/security`        | —                                      | `200 { "user": User, "passwordChangedAt": ISO \| null, "sessionTtlSeconds", "passwordMinLength", "passwordPolicy", "resetEmailEnabled" }`                                                                                                                               |
| POST   | `/auth/change-password` | `{ "currentPassword", "newPassword" }` | `200 LoginResponse` (fresh token; tokens issued before the change are rejected) · `400 VALIDATION_ERROR` with `errors[].field` = `currentPassword` or `newPassword`                                                                                                     |
| POST   | `/auth/forgot-password` | `{ "email" }`                          | **public** · `202 { "message" }` — identical whether or not the account exists; emails a one-time link `FRONTEND_URL/admin/reset-password?token=…` (valid `PASSWORD_RESET_TTL_MINUTES`, default 30; newest link wins). Without SMTP the link is written to the API log. |
| POST   | `/auth/reset-password`  | `{ "token", "newPassword" }`           | **public** · `204` · `400 INVALID_TOKEN` (unknown, used or expired) · `400 VALIDATION_ERROR`                                                                                                                                                                            |

`User`: `{ "id", "email", "name", "role": "ADMIN" \| "EDITOR" \| "AUTHOR", "authorSlug"?: string }`

### Roles

| Role     | Permissions                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------- |
| `ADMIN`  | Everything, including users, settings, deletes                                                    |
| `EDITOR` | Create / edit / publish / schedule / archive any article; manage categories, tags, authors, media |
| `AUTHOR` | Create and edit **own** articles (drafts); cannot publish, delete, or edit others'                |

Admin bootstrap: on startup, if no users exist, an `ADMIN` is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` env vars.

Password policy: at least 10 characters including a letter and a number, not in a small common-password denylist, and different from the current password. Any password change (self-service or reset) stamps `users.password_changed_at`; JWTs with an `iat` before it are rejected, which signs out every other device.

Rate limiting: `/auth/login`, `/auth/forgot-password` and `/auth/reset-password` are each limited to 10 attempts per IP per minute (`429 RATE_LIMITED`). The Next.js proxy forwards the visitor's IP in `X-Forwarded-For`.

---

## 2. Common shapes

### Pagination

Query: `?page=0&size=12` (size ≤ 50). Response:

```json
{ "content": [...], "page": 0, "size": 12, "totalElements": 124, "totalPages": 11, "last": false }
```

### Errors

```json
{
  "timestamp": "2026-10-14T09:00:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid article data",
  "errors": [{ "field": "title", "message": "must not be blank" }]
}
```

Codes: `VALIDATION_ERROR` 400 · `INVALID_TOKEN` 400 (reset link) · `INVALID_CREDENTIALS` 401 · `UNAUTHORIZED` 401 · `FORBIDDEN` 403 · `NOT_FOUND` 404 · `CONFLICT` 409 (duplicate slug) · `INVALID_STATE` 409 (illegal transition) · `PAYLOAD_TOO_LARGE` 413 · `UNSUPPORTED_MEDIA_TYPE` 415 · `RATE_LIMITED` 429 · `INTERNAL_ERROR` 500. Stack traces are never returned.

### Media reference

```json
{
  "id": "uuid",
  "url": "/media/files/2026/10/abc.webp",
  "altText": "…",
  "width": 1600,
  "height": 900,
  "mimeType": "image/webp",
  "sizeBytes": 123456,
  "originalFilename": "…",
  "createdAt": "…"
}
```

`url` may be absolute (`https://api.example.com/media/files/…`) or site-relative (seed content reuses `/images/photos/*.jpg` hosted by the frontend). Clients must handle both.

### Article status machine

```
DRAFT ──publish──▶ PUBLISHED ──unpublish──▶ DRAFT
DRAFT ──schedule(scheduledAt)──▶ SCHEDULED ──(scheduler, at scheduledAt)──▶ PUBLISHED
SCHEDULED ──unschedule/unpublish──▶ DRAFT
any ──archive──▶ ARCHIVED ──unarchive──▶ DRAFT
```

Publishing validation (also applied when scheduling): `title`, `slug`, `excerpt`, `contentHtml` (non-empty text), `categoryId`, `authorId`, `coverImageId`, `seoDescription` are all required → otherwise `400 VALIDATION_ERROR` listing missing fields.

A scheduler runs every 60 s and publishes `SCHEDULED` articles whose `scheduledAt <= now()`.

### ArticleSummary

```json
{
  "id": "uuid",
  "slug": "building-resilient-enterprise-network-infrastructure",
  "title": "…",
  "excerpt": "…",
  "coverImage": Media | null,
  "category": { "id", "name", "slug" },
  "tags": [ { "id", "name", "slug" } ],
  "author": { "id", "name", "slug", "position", "avatar": Media | null },
  "status": "PUBLISHED",
  "featured": true,
  "readingTimeMinutes": 8,
  "viewCount": 1203,
  "publishedAt": "2026-10-14T06:00:00Z" | null,
  "scheduledAt": null,
  "createdAt": "…",
  "updatedAt": "…"
}
```

### ArticleDetail = ArticleSummary +

```json
{
  "contentHtml": "<h2 id=\"why-it-matters\">…</h2>…",   // sanitized; h2/h3 carry stable ids
  "contentJson": { ... } | null,                           // editor document (ProseMirror JSON)
  "toc": [ { "id": "why-it-matters", "text": "Why it matters", "level": 2 } ],
  "seo": { "title", "description", "canonicalUrl", "ogImage": Media | null, "noIndex": false },
  "related": [ ArticleSummary ]                              // ≤ 3; same category, then shared tags, then newest
}
```

### ArticleRequest (create / update)

```json
{
  "title": "…",                      // required
  "slug": "optional-custom-slug",    // auto-generated from title when omitted; uniqueness enforced (-2, -3 suffix on auto)
  "excerpt": "…",
  "contentHtml": "…",                // sanitized server-side (OWASP HTML sanitizer policy: headings, p, lists, blockquote, pre/code, a[href], img[src|alt], table, hr, figure/figcaption, strong/em/u/s, div.callout[data-type])
  "contentJson": { ... },
  "coverImageId": "uuid" | null,
  "categoryId": "uuid" | null,
  "tagIds": [ "uuid" ],
  "authorId": "uuid" | null,
  "featured": false,
  "seoTitle": "…", "seoDescription": "…", "canonicalUrl": "…", "ogImageId": "uuid" | null, "noIndex": false
}
```

`readingTimeMinutes` is computed server-side (words / 220, min 1). Every update stores the previous version in `article_revisions`.

---

## 3. Public endpoints (published content only)

| Method | Path                              | Query                                                         | Response                                                                                                                                         |
| ------ | --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/public/articles`                | `page,size,category,tag,author,featured,sort=newest\|popular` | `Page<ArticleSummary>`                                                                                                                           |
| GET    | `/public/articles/featured`       | `limit` (default 1, ≤ 3)                                      | `ArticleSummary[]` — featured first; falls back to newest published                                                                              |
| GET    | `/public/articles/search`         | `q` (required, ≥ 2 chars), `page,size`                        | `Page<ArticleSummary & { "highlight": "…<mark>term</mark>…" }>` — PostgreSQL full-text over title, excerpt, content text, category, tags, author |
| GET    | `/public/articles/{slug}`         | —                                                             | `ArticleDetail` · `404` when not published                                                                                                       |
| GET    | `/public/articles/{slug}/related` | `limit` (≤ 6)                                                 | `ArticleSummary[]`                                                                                                                               |
| POST   | `/public/articles/{slug}/view`    | —                                                             | `204` — deduplicated per (article, hashed IP+UA) per day                                                                                         |
| GET    | `/public/categories`              | —                                                             | `Category[]` `{ id,name,slug,description,tagline,articleCount, sortOrder }` (only categories with published articles unless `all=true`)          |
| GET    | `/public/categories/{slug}`       | —                                                             | `Category & { "related": Category[] }`                                                                                                           |
| GET    | `/public/tags`                    | —                                                             | `Tag[]` `{ id,name,slug,articleCount }`                                                                                                          |
| GET    | `/public/tags/{slug}`             | —                                                             | `Tag`                                                                                                                                            |
| GET    | `/public/authors`                 | —                                                             | `Author[]` `{ id,name,slug,position,bio,avatar,linkedinUrl,articleCount }`                                                                       |
| GET    | `/public/authors/{slug}`          | —                                                             | `Author`                                                                                                                                         |
| GET    | `/public/sitemap`                 | —                                                             | `{ "articles": [{slug,updatedAt}], "categories": [{slug}], "tags": [{slug}], "authors": [{slug}] }`                                              |
| POST   | `/public/newsletter/subscribe`    | body `{ "email", "source"? }`                                 | `202 { "status": "PENDING" }` — stored; provider integration is pluggable (`NewsletterProvider`, default no-op)                                  |

---

## 4. Admin endpoints

All require a bearer token. Role notes in the last column.

### Articles

| Method | Path                                            | Body / Query                                                                        | Notes                                                  |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------ |
| GET    | `/articles`                                     | `page,size,status,category,author,q,featured,sort=updated\|published\|views\|title` | AUTHOR sees own only                                   |
| GET    | `/articles/{id}`                                | —                                                                                   | `ArticleDetail` (any status)                           |
| GET    | `/articles/{id}/preview`                        | —                                                                                   | `ArticleDetail` rendered exactly as public, any status |
| POST   | `/articles`                                     | `ArticleRequest`                                                                    | creates `DRAFT`; `201` with `Location`                 |
| PUT    | `/articles/{id}`                                | `ArticleRequest`                                                                    | saves revision first; AUTHOR own only                  |
| DELETE | `/articles/{id}`                                | —                                                                                   | ADMIN only (hard delete)                               |
| POST   | `/articles/{id}/publish`                        | —                                                                                   | EDITOR/ADMIN; validation above                         |
| POST   | `/articles/{id}/unpublish`                      | —                                                                                   | → `DRAFT`                                              |
| POST   | `/articles/{id}/schedule`                       | `{ "scheduledAt": "ISO-8601" }` (future)                                            | → `SCHEDULED`                                          |
| POST   | `/articles/{id}/archive`                        | —                                                                                   | → `ARCHIVED`                                           |
| POST   | `/articles/{id}/unarchive`                      | —                                                                                   | → `DRAFT`                                              |
| POST   | `/articles/{id}/feature`                        | `{ "featured": true }`                                                              | EDITOR/ADMIN                                           |
| GET    | `/articles/{id}/revisions`                      | —                                                                                   | `[{ id, version, title, createdAt, createdBy }]`       |
| GET    | `/articles/{id}/revisions/{revisionId}`         | —                                                                                   | full snapshot                                          |
| POST   | `/articles/{id}/revisions/{revisionId}/restore` | —                                                                                   | restores content into a new revision                   |

### Categories, tags, authors

| Method     | Path               | Body                                                             |
| ---------- | ------------------ | ---------------------------------------------------------------- |
| GET/POST   | `/categories`      | `{ name, slug?, description, tagline, sortOrder }`               |
| PUT/DELETE | `/categories/{id}` | delete refused (`409 CONFLICT`) while articles reference it      |
| GET/POST   | `/tags`            | `{ name, slug? }`                                                |
| PUT/DELETE | `/tags/{id}`       |                                                                  |
| GET/POST   | `/authors`         | `{ name, slug?, position, bio, avatarId, linkedinUrl, userId? }` |
| PUT/DELETE | `/authors/{id}`    | delete refused while articles reference it                       |

### Media

| Method | Path                  | Body                                                                                                                      |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/media`              | multipart: `file` (jpeg/png/webp/gif, ≤ `MEDIA_MAX_SIZE_MB`, MIME verified from bytes, min 320×180), `altText` (required) |
| GET    | `/media`              | `page,size,q`                                                                                                             |
| PUT    | `/media/{id}`         | `{ "altText" }`                                                                                                           |
| POST   | `/media/{id}/replace` | multipart `file` — keeps id and URL semantics                                                                             |
| DELETE | `/media/{id}`         | refused while referenced                                                                                                  |

Storage is behind `StorageService` (`local` implementation writes to `MEDIA_STORAGE_PATH`; S3-compatible can be added without touching domain code).

### Dashboard & settings

| Method   | Path               | Response                                                                                                                                                                                                                     |
| -------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET      | `/dashboard/stats` | `{ totalArticles, published, drafts, scheduled, archived, totalViews, viewsLast30Days:[{date,views}], mostRead:[ArticleSummary], recent:[ArticleSummary], recentActivity:[{ at, actor, action, articleTitle, articleId }] }` |
| GET      | `/settings`        | `{ siteTitle, blogTitle, blogTagline, newsletterHeading, newsletterText, defaultOgImage: Media\|null }`                                                                                                                      |
| PUT      | `/settings`        | same shape (ADMIN)                                                                                                                                                                                                           |
| GET/POST | `/users`           | ADMIN: `{ email, name, role, password }`                                                                                                                                                                                     |
| PUT      | `/users/{id}`      | ADMIN                                                                                                                                                                                                                        |

---

## 5. Cache revalidation

After publish / unpublish / archive / update of a published article / scheduler publish, the backend POSTs to `REVALIDATE_URL` (the Next.js `/api/revalidate` route):

```json
{
  "secret": "<REVALIDATE_SECRET>",
  "tags": ["articles", "article:<slug>", "category:<slug>", "author:<slug>"]
}
```

Failures are logged and never block the editorial action.

---

## 6. Environment

| Variable                                        | Default                                       | Purpose                                                    |
| ----------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`                                  | `jdbc:postgresql://localhost:5432/yaron_blog` |                                                            |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD`       | `yaron` / `yaron`                             |                                                            |
| `JWT_SECRET`                                    | — (required, ≥ 32 chars)                      |                                                            |
| `JWT_TTL_SECONDS`                               | `43200`                                       |                                                            |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | —                                             | bootstrap admin                                            |
| `CORS_ALLOWED_ORIGINS`                          | `http://localhost:3000`                       | comma-separated                                            |
| `MEDIA_STORAGE_PATH`                            | `./data/media`                                | local storage root                                         |
| `MEDIA_PUBLIC_BASE_URL`                         | `http://localhost:8080`                       | prefix for uploaded media URLs                             |
| `MEDIA_MAX_SIZE_MB`                             | `8`                                           |                                                            |
| `REVALIDATE_URL` / `REVALIDATE_SECRET`          | —                                             | Next.js revalidation hook                                  |
| `SEED_SAMPLE_CONTENT`                           | `false`                                       | insert the clearly-labelled sample articles on first start |
| `SERVER_PORT`                                   | `8080`                                        |                                                            |

---

## 7. Contact messages (added)

Submissions from the website contact form are stored and managed in the CMS inbox.

| Method | Path                                                                | Auth                                            | Body / Query                                                             | Response                                        |
| ------ | ------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| POST   | `/public/contact`                                                   | none (5 per IP per 10 min → `429 RATE_LIMITED`) | `{ name, email, organization?, subject, message (≥ 20 chars), source? }` | `202 { "status": "RECEIVED", "id" }`            |
| GET    | `/contact-messages`                                                 | EDITOR/ADMIN                                    | `page,size,status=NEW\|READ\|REPLIED\|ARCHIVED,q`                        | `Page<ContactMessage>`                          |
| GET    | `/contact-messages/summary`                                         | EDITOR/ADMIN                                    | —                                                                        | `{ unread, total, last24h, replied, archived }` |
| GET    | `/contact-messages/{id}`                                            | EDITOR/ADMIN                                    | —                                                                        | `ContactMessage`                                |
| POST   | `/contact-messages/{id}/read` · `/unread` · `/replied` · `/archive` | EDITOR/ADMIN                                    | —                                                                        | updated `ContactMessage`                        |
| PUT    | `/contact-messages/{id}/notes`                                      | EDITOR/ADMIN                                    | `{ notes }`                                                              | updated `ContactMessage`                        |
| DELETE | `/contact-messages/{id}`                                            | ADMIN                                           | —                                                                        | `204`                                           |

`ContactMessage`: `{ id, name, email, organization, subject, message, status, notes, createdAt, updatedAt, readAt, repliedAt }`. The dashboard `Stats` object additionally carries `unreadMessages` and `recentMessages` (latest 5). Sender IPs are stored only as a SHA-256 hash.
