CREATE TABLE tags (
  id         uuid PRIMARY KEY,
  name       varchar(120) NOT NULL UNIQUE,
  slug       varchar(140) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
