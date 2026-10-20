-- Editable website content. One row per section ("company", "home", "services", ...).
-- `data` holds the section's JSON document; when a row is absent the frontend uses its
-- built-in defaults, so deleting a row restores the original content.
CREATE TABLE site_content (
  section    varchar(60) PRIMARY KEY,
  data       text        NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by varchar(200)
);
