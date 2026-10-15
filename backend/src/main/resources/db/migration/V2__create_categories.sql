CREATE TABLE categories (
  id          uuid PRIMARY KEY,
  name        varchar(120) NOT NULL UNIQUE,
  slug        varchar(140) NOT NULL UNIQUE,
  description text,
  tagline     varchar(240),
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
