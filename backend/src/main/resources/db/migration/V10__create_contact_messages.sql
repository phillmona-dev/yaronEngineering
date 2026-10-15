CREATE TABLE contact_messages (
  id           uuid PRIMARY KEY,
  name         varchar(120) NOT NULL,
  email        varchar(200) NOT NULL,
  organization varchar(160),
  subject      varchar(120) NOT NULL,
  message      text NOT NULL,
  status       varchar(20) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','READ','REPLIED','ARCHIVED')),
  ip_hash      varchar(64),
  user_agent   varchar(300),
  source       varchar(60),
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  read_at      timestamptz,
  replied_at   timestamptz
);
CREATE INDEX idx_contact_messages_status_created ON contact_messages (status, created_at DESC);
CREATE INDEX idx_contact_messages_created ON contact_messages (created_at DESC);
