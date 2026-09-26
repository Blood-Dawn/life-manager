-- Life Manager database schema
-- Run once in the Supabase SQL editor (or via psql against SUPABASE_DB_URL) before using the app.

-- Finance
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  monthly_limit numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, category)
);

-- Habits
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text default '✅',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

-- House
create table chores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  zone text,
  frequency text not null default 'one_time' check (frequency in ('one_time', 'daily', 'weekly', 'monthly')),
  due_date date,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create table shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  quantity text,
  is_purchased boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row level security: every table only returns or accepts rows where user_id
-- matches the signed-in user, so the anon key alone can never read or edit
-- someone else's data.

alter table transactions enable row level security;
create policy "Users manage their own transactions"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table budgets enable row level security;
create policy "Users manage their own budgets"
  on budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table habits enable row level security;
create policy "Users manage their own habits"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table habit_logs enable row level security;
create policy "Users manage their own habit logs"
  on habit_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table chores enable row level security;
create policy "Users manage their own chores"
  on chores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table shopping_items enable row level security;
create policy "Users manage their own shopping items"
  on shopping_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
