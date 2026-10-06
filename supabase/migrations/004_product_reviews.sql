create table if not exists product_reviews(
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products on delete cascade,
  name text not null check(char_length(name) between 2 and 60),
  rating int not null check(rating between 1 and 5),
  comment text not null check(char_length(comment) between 3 and 1000),
  created_at timestamptz not null default now()
);
alter table product_reviews enable row level security;
create policy public_reviews on product_reviews for select to anon,authenticated using(true);
create policy admin_reviews on product_reviews for all to authenticated using(is_admin()) with check(is_admin());
create index if not exists product_reviews_product_created on product_reviews(product_id,created_at desc);
