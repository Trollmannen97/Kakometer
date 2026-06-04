create table if not exists public.cakes (
  id text primary key,
  date date not null,
  reason text not null,
  type text not null,
  created_at timestamptz not null default now()
);

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

insert into public.cakes (id, date, reason, type)
values
  ('cake-1', '2026-01-30', 'Martin på Outlet slutter', 'Marsipankake'),
  ('cake-2', '2026-02-26', 'Bursdag', 'Sjokoladekake'),
  ('cake-3', '2026-05-11', 'Sebastian 30 år', 'Marsipankake'),
  ('cake-4', '2026-05-19', 'Rester fra Mattias 17. mai', 'Kladdkake'),
  ('cake-5', '2026-05-29', 'Bastian 30 år', 'Marsipankake'),
  ('cake-6', '2026-06-08', 'Magnus fagbrev', 'Sjokoladekake')
on conflict (id) do nothing;
