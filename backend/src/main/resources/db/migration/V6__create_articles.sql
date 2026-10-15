CREATE TABLE articles (
  id                   uuid PRIMARY KEY,
  title                varchar(240) NOT NULL,
  slug                 varchar(260) NOT NULL UNIQUE,
  excerpt              text,
  content_html         text,
  content_json         jsonb,
  content_text         text,
  cover_image_id       uuid REFERENCES media (id) ON DELETE SET NULL,
  category_id          uuid REFERENCES categories (id),
  author_id            uuid REFERENCES authors (id),
  created_by           uuid REFERENCES users (id) ON DELETE SET NULL,
  status               varchar(20) NOT NULL CHECK (status IN ('DRAFT','SCHEDULED','PUBLISHED','ARCHIVED')),
  featured             boolean NOT NULL DEFAULT false,
  reading_time_minutes int NOT NULL DEFAULT 1,
  view_count           bigint NOT NULL DEFAULT 0,
  seo_title            varchar(240),
  seo_description      varchar(400),
  canonical_url        varchar(600),
  og_image_id          uuid REFERENCES media (id) ON DELETE SET NULL,
  no_index             boolean NOT NULL DEFAULT false,
  published_at         timestamptz,
  scheduled_at         timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  search_vector        tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content_text, '')), 'C')
  ) STORED
);
CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);
CREATE INDEX idx_articles_category ON articles (category_id);
CREATE INDEX idx_articles_author ON articles (author_id);
CREATE INDEX idx_articles_scheduled ON articles (scheduled_at) WHERE status = 'SCHEDULED';
CREATE INDEX idx_articles_search ON articles USING gin (search_vector);

CREATE TABLE article_tags (
  article_id uuid NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);
CREATE INDEX idx_article_tags_tag ON article_tags (tag_id);

CREATE TABLE article_views (
  id           uuid PRIMARY KEY,
  article_id   uuid NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  visitor_hash varchar(64) NOT NULL,
  view_date    date NOT NULL,
  viewed_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_id, visitor_hash, view_date)
);
CREATE INDEX idx_article_views_date ON article_views (view_date);

CREATE TABLE publication_schedule (
  id           uuid PRIMARY KEY,
  article_id   uuid NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  status       varchar(20) NOT NULL CHECK (status IN ('PENDING','PUBLISHED','CANCELLED')),
  created_by   uuid REFERENCES users (id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  executed_at  timestamptz
);
CREATE INDEX idx_publication_schedule_pending ON publication_schedule (scheduled_at) WHERE status = 'PENDING';

CREATE TABLE article_activity (
  id            uuid PRIMARY KEY,
  article_id    uuid REFERENCES articles (id) ON DELETE CASCADE,
  article_title varchar(240),
  action        varchar(40) NOT NULL,
  actor         varchar(200),
  at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_article_activity_at ON article_activity (at DESC);
