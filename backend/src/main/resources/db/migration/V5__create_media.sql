CREATE TABLE media (
  id                uuid PRIMARY KEY,
  storage_key       varchar(300),
  url               varchar(600) NOT NULL,
  alt_text          varchar(300) NOT NULL,
  width             int,
  height            int,
  mime_type         varchar(60) NOT NULL,
  size_bytes        bigint NOT NULL DEFAULT 0,
  original_filename varchar(300),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE authors ADD CONSTRAINT fk_authors_avatar FOREIGN KEY (avatar_id) REFERENCES media (id) ON DELETE SET NULL;
