-- Homeward database for Supabase (free tier). Paste into Supabase → SQL Editor → Run.
-- Clients see only their own homes; staff (role 'staff' or 'admin') see everything.

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, phone text, lang text default 'en',
  role text not null default 'client' check (role in ('client','staff','admin','partner')),
  referral_code text unique default substr(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  address text not null, neighborhood text, plan text check (plan in ('essential','signature','estate')),
  key_code text, emergency_plan jsonb default '{}'::jsonb, created_at timestamptz default now()
);

create table if not exists property_access (  -- family, attorney, agent who may read reports
  property_id uuid references properties(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  access text default 'reports' check (access in ('reports','full')),
  primary key (property_id, user_id)
);

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  inspector_id uuid references profiles(id), inspector_name text,
  visited_at timestamptz default now(), photo_count int default 0,
  result text default 'all_clear', notes text, checklist jsonb default '{}'::jsonb
);

create table if not exists visit_photos (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references visits(id) on delete cascade,
  storage_path text not null, checkpoint text, taken_at timestamptz default now()
);

create table if not exists mail_items (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  received_at date default current_date, sender text, scan_path text,
  action text default 'pending' check (action in ('pending','open_scan','forward','shred','done'))
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  created_by uuid references profiles(id), kind text, details text,
  status text default 'new' check (status in ('new','scheduled','done','cancelled')),
  created_at timestamptz default now()
);

create table if not exists leads (  -- every website form lands here
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text, phone text, email text, area text, need text, message text, lang text,
  source text, page text, plan text, ref text, utm_source text, utm_medium text, utm_campaign text,
  status text default 'new'
);

alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_access enable row level security;
alter table visits enable row level security;
alter table visit_photos enable row level security;
alter table mail_items enable row level security;
alter table requests enable row level security;
alter table leads enable row level security;

create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role in ('staff','admin')) $$;

create or replace function can_see(p uuid) returns boolean language sql stable security definer set search_path = public as
$$ select is_staff()
     or exists (select 1 from properties where id = p and owner_id = auth.uid())
     or exists (select 1 from property_access where property_id = p and user_id = auth.uid()) $$;

create policy "own profile" on profiles for select using (id = auth.uid() or is_staff());
create policy "update own profile" on profiles for update using (id = auth.uid());
create policy "see properties" on properties for select using (can_see(id));
create policy "staff manage properties" on properties for all using (is_staff());
create policy "see access" on property_access for select using (can_see(property_id));
create policy "see visits" on visits for select using (can_see(property_id));
create policy "staff write visits" on visits for all using (is_staff());
create policy "see photos" on visit_photos for select using (exists (select 1 from visits v where v.id = visit_id and can_see(v.property_id)));
create policy "staff write photos" on visit_photos for all using (is_staff());
create policy "see mail" on mail_items for select using (can_see(property_id));
create policy "client sets mail action" on mail_items for update using (can_see(property_id));
create policy "staff write mail" on mail_items for all using (is_staff());
create policy "see requests" on requests for select using (can_see(property_id));
create policy "client creates requests" on requests for insert with check (can_see(property_id));
create policy "staff manage requests" on requests for all using (is_staff());
-- Website visitors may only add leads, never read them.
create policy "anyone can submit a lead" on leads for insert to anon, authenticated with check (true);
create policy "staff read leads" on leads for select using (is_staff());

-- Private storage bucket for visit photos and mail scans.
insert into storage.buckets (id, name, public) values ('homes', 'homes', false) on conflict do nothing;
