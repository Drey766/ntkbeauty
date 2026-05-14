-- NT Beauty Kenya — Supabase Database Schema
-- Run this in your Supabase SQL Editor before seeding data

-- ── Enable extensions ─────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles (auto-created on user signup) ────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz default now()
);

-- Trigger: auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Products ──────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  description   text default '',
  price         integer not null,               -- KES, no decimals
  original_price integer,
  images        text[] default array[]::text[],
  category      text not null,
  brand         text default '',
  skin_types    text[] default array['All'],
  concerns      text[] default array[]::text[],
  in_stock      boolean default true,
  is_featured   boolean default false,
  is_new        boolean default false,
  rating        numeric(3,1) default 4.5,
  review_count  integer default 0,
  ingredients   text default '',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_products_slug on public.products(slug);

-- ── Orders ────────────────────────────────────────────────────────────────────
create type if not exists order_status as enum ('pending','confirmed','processing','shipped','delivered','cancelled');
create type if not exists payment_status as enum ('pending','paid','failed');

create table if not exists public.orders (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references public.profiles(id) on delete set null,
  items                 jsonb not null,
  shipping_address      jsonb not null,
  subtotal              integer not null,
  shipping_fee          integer not null default 0,
  total                 integer not null,
  status                order_status default 'pending',
  payment_method        text not null default 'mpesa',
  payment_status        payment_status default 'pending',
  mpesa_transaction_id  text,
  created_at            timestamptz default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);

-- ── Blog Posts ────────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text not null unique,
  excerpt     text default '',
  content     text default '',
  cover_image text default '',
  category    text default 'Skincare Basics',
  author_name text default 'NT Beauty Team',
  published   boolean default false,
  read_time   integer default 5,
  created_at  timestamptz default now()
);

create index if not exists idx_blog_published on public.blog_posts(published);

-- ── Reviews ───────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id                uuid primary key default uuid_generate_v4(),
  product_id        uuid references public.products(id) on delete cascade,
  user_id           uuid references public.profiles(id) on delete set null,
  user_name         text not null,
  rating            integer not null check (rating between 1 and 5),
  comment           text default '',
  verified_purchase boolean default false,
  created_at        timestamptz default now()
);

create index if not exists idx_reviews_product_id on public.reviews(product_id);

-- ── Newsletter Subscribers ────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products — public read, admin write
alter table public.products enable row level security;
create policy "Products are publicly readable" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update products" on public.products for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete products" on public.products for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Orders — users see own orders, admins see all
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Anyone can insert orders" on public.orders for insert with check (true);
create policy "Admins can view all orders" on public.orders for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update orders" on public.orders for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Blog posts — public read published, admin write
alter table public.blog_posts enable row level security;
create policy "Published posts are public" on public.blog_posts for select using (published = true);
create policy "Admins can manage blog" on public.blog_posts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Reviews — public read, authenticated insert
alter table public.reviews enable row level security;
create policy "Reviews are public" on public.reviews for select using (true);
create policy "Authenticated users can add reviews" on public.reviews for insert with check (auth.role() = 'authenticated');

-- Newsletter — anyone can subscribe
alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "Admins can view subscribers" on public.newsletter_subscribers for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ── Storage Bucket ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public can view product images" on storage.objects for select
  using (bucket_id = 'products');
create policy "Authenticated users can upload product images" on storage.objects for insert
  with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "Admins can delete product images" on storage.objects for delete
  using (bucket_id = 'products' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
