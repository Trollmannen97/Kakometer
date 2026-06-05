create table if not exists public.cakes (
  id text primary key,
  date date not null,
  reason text not null,
  type text not null,
  amount integer not null default 1 check (amount > 0),
  created_at timestamptz not null default now()
);

alter table public.cakes
add column if not exists amount integer not null default 1 check (amount > 0);

alter table public.cakes enable row level security;

drop policy if exists "Anyone can read cakes" on public.cakes;
create policy "Anyone can read cakes"
on public.cakes
for select
to anon
using (true);

drop policy if exists "Anyone can add cakes" on public.cakes;
create policy "Anyone can add cakes"
on public.cakes
for insert
to anon
with check (true);

drop policy if exists "Anyone can delete cakes" on public.cakes;
create policy "Anyone can delete cakes"
on public.cakes
for delete
to anon
using (true);

insert into public.cakes (id, date, reason, type, amount)
values
  ('cake-1', '2026-01-30', 'Martin på Outlet slutter', 'Marsipankake', 1),
  ('cake-2', '2026-02-26', 'Bursdag', 'Sjokoladekake', 1),
  ('cake-3', '2026-05-11', 'Sebastian 30 år', 'Marsipankake', 1),
  ('cake-4', '2026-05-19', 'Rester fra Mattias 17. mai', 'Kladdkake', 1),
  ('cake-5', '2026-05-29', 'Bastian 30 år', 'Marsipankake', 1),
  ('cake-6', '2026-06-08', 'Magnus fagbrev', 'Sjokoladekake', 1),
  ('cake-2025-01', '2025-01-24', 'Årets Selekt Selger', 'Ikke registrert', 1),
  ('cake-2025-02', '2025-01-31', 'Avslutning for Rune og Chris', 'Ikke registrert', 1),
  ('cake-2025-03', '2025-02-08', 'Helge 40 år', 'Ikke registrert', 1),
  ('cake-2025-04', '2025-06-02', 'Morten 30år i VCSO', 'Sjokoladekake, marsipankake og suksessterte', 1),
  ('cake-2025-05', '2025-06-23', 'Clera hadde bursdag', 'Gulrotkake', 1),
  ('cake-2025-06', '2025-07-01', 'Polestar har levert mange biler', 'Marsipankake', 1),
  ('cake-2025-07', '2025-08-15', 'Maja har bursdag', 'Sjokoladekake', 1),
  ('cake-2025-08', '2025-09-22', 'Victor 30 år', 'Sjokoladekake, marsipankake', 1),
  ('cake-2025-09', '2025-10-07', 'Ole Aleksander slutter', 'Marsipankake', 1),
  ('cake-2025-10', '2025-10-14', 'Balder 30 år', 'Marsipankake og sjokoladekake', 1),
  ('cake-2025-11', '2025-11-10', 'Monica bursdag', 'Sjokoladekake', 1),
  ('cake-2025-12', '2025-11-21', 'Salgsrekord Volvo i oktober', 'Marsipankake', 1),
  ('cake-2025-13', '2025-11-28', 'Iselin 30 år', 'Sjokoladekake og suksessterte', 1),
  ('cake-2025-14', '2025-12-10', 'Zeekr var fornøyde med oss', 'Marsipankake', 1),
  ('cake-2025-15', '2025-12-17', 'Polestar har nådd målet sitt', 'Marsipankake', 1)
on conflict (id) do nothing;
