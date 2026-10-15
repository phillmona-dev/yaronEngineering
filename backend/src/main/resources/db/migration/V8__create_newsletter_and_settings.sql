CREATE TABLE newsletter_subscribers (
  id         uuid PRIMARY KEY,
  email      varchar(200) NOT NULL UNIQUE,
  status     varchar(20) NOT NULL CHECK (status IN ('PENDING','CONFIRMED','UNSUBSCRIBED')),
  source     varchar(120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE settings (
  key        varchar(80) PRIMARY KEY,
  value      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
