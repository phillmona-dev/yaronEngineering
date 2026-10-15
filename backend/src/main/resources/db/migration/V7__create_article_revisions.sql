CREATE TABLE article_revisions (
  id              uuid PRIMARY KEY,
  article_id      uuid NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  version         int NOT NULL,
  title           varchar(240) NOT NULL,
  slug            varchar(260) NOT NULL,
  excerpt         text,
  content_html    text,
  content_json    jsonb,
  seo_title       varchar(240),
  seo_description varchar(400),
  created_by      varchar(200),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_id, version)
);
