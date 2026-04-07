-- Dashboard tables (accessed via service role from API routes; RLS on, no anon policies).

create table if not exists public.teachers (
  id text primary key,
  full_name text not null,
  specialty text not null,
  profile_image_placeholder text not null
);

create table if not exists public.students (
  id text primary key,
  full_name text not null,
  age int not null,
  level text not null,
  shirt_size text not null,
  phone text not null,
  email text not null,
  relation text not null,
  parent_name text,
  profile_image_placeholder text not null
);

create table if not exists public.dances (
  id text primary key,
  name text not null,
  source text not null,
  duration_minutes int not null,
  lead_teacher_id text not null references public.teachers (id) on delete restrict,
  music_file_url text not null,
  student_ids jsonb not null default '[]'::jsonb
);

create table if not exists public.app_meta (
  id text primary key default 'main',
  year int not null,
  theme text not null,
  notes text not null
);

create table if not exists public.grants (
  id text primary key,
  name text not null,
  funder text not null,
  status text not null,
  funding_result text not null,
  potential_amount numeric not null,
  due_date text not null,
  focus text not null,
  notes text not null
);

create table if not exists public.expenses (
  id text primary key,
  date text not null,
  category text not null,
  vendor text not null,
  description text not null,
  amount numeric not null,
  status text not null
);

create table if not exists public.wishlist_items (
  id text primary key,
  label text not null,
  estimated_amount numeric not null,
  category text not null,
  note text,
  amount_suffix text,
  added_by text,
  sort_order int not null default 0
);

create table if not exists public.program_milestones (
  id text primary key,
  week_of text not null,
  focus text not null,
  owner text not null,
  completed boolean not null default false
);

create table if not exists public.budget_categories (
  id text primary key,
  name text not null,
  planned numeric not null,
  spent numeric not null
);

alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.dances enable row level security;
alter table public.app_meta enable row level security;
alter table public.grants enable row level security;
alter table public.expenses enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.program_milestones enable row level security;
alter table public.budget_categories enable row level security;
