# Yaron Engineering Knowledge Hub — Backend API

Spring Boot 3.5 · Java 21 · PostgreSQL 16 · Flyway · Spring Security (JWT). Implements the contract in [`../API_DOCUMENTATION.md`](../API_DOCUMENTATION.md).

## Modules (packages under `com.yaronengineering.blog`)

| Package                     | Responsibility                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `article`                   | Article entity, revisions, activity log, status machine, admin + public controllers, sitemap                |
| `category`, `tag`, `author` | Taxonomy and author profiles (admin CRUD + public read)                                                     |
| `media`                     | Uploads, MIME/size/dimension validation, `StorageService` abstraction (`LocalStorageService`)               |
| `search`                    | PostgreSQL full-text search with highlighted snippets                                                       |
| `publication`               | Scheduled publishing (`@Scheduled` every 60 s), `publication_schedule` ledger, Next.js revalidation webhook |
| `analytics`                 | De-duplicated article views (SHA-256 of IP + user agent, one per day)                                       |
| `auth`, `user`              | JWT login, rate limiting, roles ADMIN / EDITOR / AUTHOR, admin bootstrap                                    |
| `newsletter`                | Subscriber storage with pluggable `NewsletterProvider` (no-op by default)                                   |
| `settings`, `dashboard`     | Site settings key/value store, dashboard statistics                                                         |
| `seed`                      | Development-only sample articles (`SEED_SAMPLE_CONTENT=true`)                                               |
| `common`, `config`          | Error model, pagination, slugs, HTML sanitizer, security/CORS/web config                                    |

## Run locally (existing PostgreSQL)

```bash
# 1. database
sudo -u postgres psql -c "CREATE USER yaron WITH PASSWORD 'yaron';"
sudo -u postgres psql -c "CREATE DATABASE yaron_blog OWNER yaron;"

# 2. environment
cp .env.example .env            # edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
set -a; source .env; set +a

# 3. run (Java 21 required)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
mvn spring-boot:run
```

Flyway creates the schema on first start, seeds the 12 categories, and the admin user is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. With `SEED_SAMPLE_CONTENT=true` five clearly labelled sample articles are inserted (their excerpts start with `[Sample article for development]`).

Health: `GET http://localhost:8080/actuator/health`

## Tests

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
mvn test            # integration tests use Testcontainers (Docker required)
mvn -DskipTests package   # builds target/blog-api-1.0.0.jar
```

## Docker

```bash
docker build -t yaron-blog-api .
docker run --env-file .env -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/yaron_blog -p 8080:8080 yaron-blog-api
```

The root `docker-compose.yml` wires PostgreSQL, this API and the Next.js frontend together.

## Curl walkthrough

```bash
API=http://localhost:8080/api/v1

# login
TOKEN=$(curl -s -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@yaronengineering.com","password":"change-me-strong-password"}' | jq -r .accessToken)

# look up ids
CAT=$(curl -s $API/public/categories?all=true | jq -r '.[0].id')
AUTHOR=$(curl -s $API/public/authors | jq -r '.[0].id')   # or /api/v1/authors with the token

# upload a cover image (alt text is mandatory)
MEDIA=$(curl -s -X POST $API/media -H "Authorization: Bearer $TOKEN" \
  -F file=@cover.jpg -F altText="Server racks" | jq -r .id)

# create a draft
ID=$(curl -s -X POST $API/articles -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{
  \"title\": \"Building Resilient Enterprise Networks\",
  \"excerpt\": \"Why resilience is designed, not added.\",
  \"contentHtml\": \"<h2>Start with failure domains</h2><p>Every design should begin by asking what fails together.</p>\",
  \"categoryId\": \"$CAT\", \"authorId\": \"$AUTHOR\", \"coverImageId\": \"$MEDIA\",
  \"seoDescription\": \"A practical guide to resilient enterprise network design.\"
}" | jq -r .id)

# publish now, or schedule
curl -s -X POST $API/articles/$ID/publish -H "Authorization: Bearer $TOKEN" | jq .status
curl -s -X POST $API/articles/$ID/schedule -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"scheduledAt":"2026-10-20T06:00:00Z"}'

# public read
curl -s $API/public/articles/building-resilient-enterprise-networks | jq '{title, readingTimeMinutes, toc}'
curl -s "$API/public/articles/search?q=resilient" | jq '.content[].highlight'
```

## Operational notes

- The publication scheduler assumes a single running instance. Add a distributed lock (e.g. ShedLock) before running multiple replicas.
- Uploaded media is stored under `MEDIA_STORAGE_PATH` and served at `/media/files/**`. Swap `LocalStorageService` for an S3/R2/MinIO implementation of `StorageService` without touching domain code.
- Revalidation calls to `REVALIDATE_URL` are asynchronous and best-effort; failures are logged at WARN.
- Logs never include passwords or tokens. Authentication failures, publishing events and admin mutations are logged at INFO.
