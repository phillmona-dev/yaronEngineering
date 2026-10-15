CREATE TABLE users (
  id            uuid PRIMARY KEY,
  email         varchar(200) NOT NULL UNIQUE,
  name          varchar(160) NOT NULL,
  password_hash varchar(100) NOT NULL,
  role          varchar(20)  NOT NULL CHECK (role IN ('ADMIN','EDITOR','AUTHOR')),
  enabled       boolean      NOT NULL DEFAULT true,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_email ON users (lower(email));
