create table if not exists cakes (
  id text primary key,
  date date not null,
  reason text not null,
  type text not null,
  amount integer not null default 1 check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists cakes_date_created_at_idx
on cakes (date desc, created_at desc);
