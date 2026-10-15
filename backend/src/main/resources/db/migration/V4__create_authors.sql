CREATE TABLE authors (
  id           uuid PRIMARY KEY,
  name         varchar(160) NOT NULL,
  slug         varchar(180) NOT NULL UNIQUE,
  position     varchar(160),
  bio          text,
  avatar_id    uuid,
  linkedin_url varchar(300),
  user_id      uuid REFERENCES users (id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
