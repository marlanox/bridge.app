-- THE THREE — the Vault. Run once in Supabase: SQL Editor → New query → paste → Run.

-- One row per chain. You add a code when an order is paid; it is engraved by the clasp.
create table if not exists public.codes (
  code        text primary key check (code ~ '^TT[A-Z0-9]{8,14}$'),
  order_ref   text,
  created_at  timestamptz not null default now()
);

-- One sealed letter per code. Cannot be changed after sealing.
create table if not exists public.letters (
  code         text primary key references public.codes(code) on delete cascade,
  from_name    text check (char_length(from_name) <= 80),
  body         text not null check (char_length(body) between 1 and 5000),
  media_path   text,
  media_type   text check (media_type in ('image', 'video')),
  notify_email text,
  opens_at     timestamptz not null,
  sealed_at    timestamptz not null default now(),
  check (opens_at > sealed_at and opens_at <= sealed_at + interval '366 days')
);

-- Nobody reads these tables from the browser. Only the Edge Function (service role) does.
alter table public.codes   enable row level security;
alter table public.letters enable row level security;

-- Private bucket for photographs and films.
insert into storage.buckets (id, name, public, file_size_limit)
values ('vault', 'vault', false, 52428800)
on conflict (id) do nothing;

-- Example: add codes for two paid orders (use random letters/digits, at least 8 after TT).
-- insert into public.codes (code, order_ref) values ('TT8K3M2QZ7', 'Order 001 — No. I, 55 cm'), ('TTQ4W9X2LP', 'Order 002 — No. III');
