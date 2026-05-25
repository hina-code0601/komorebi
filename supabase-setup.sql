-- ユーザー情報
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  character_id text not null default 'shizuku',
  started_at date not null default current_date,
  last_visited_at timestamp with time zone,
  plan text not null default 'free',
  created_at timestamp with time zone default now()
);

-- 日記本体
create table if not exists diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  entry_date date not null,
  good_thing text,
  hard_thing text,
  tomorrow text,
  emotion_tag text,
  created_at timestamp with time zone default now(),
  unique(user_id, entry_date)
);

-- AIサマリー（成長AI層）
create table if not exists daily_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  entry_date date not null,
  summary text,
  positive_score integer default 50,
  action_score integer default 50,
  wave_score integer default 50,
  created_at timestamp with time zone default now(),
  unique(user_id, entry_date)
);

-- ユーザープロフィールサマリー（月次更新）
create table if not exists user_profile_summary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  profile_text text,
  updated_at timestamp with time zone default now()
);

-- キャラ進化記録
create table if not exists character_evolution (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  evolution_stage integer default 0,
  unlocked_at timestamp with time zone default now()
);

-- 連続記録
create table if not exists streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_entry_date date
);

-- RLS（Row Level Security）
alter table users enable row level security;
alter table diary_entries enable row level security;
alter table daily_summaries enable row level security;
alter table user_profile_summary enable row level security;
alter table character_evolution enable row level security;
alter table streaks enable row level security;

-- ポリシー（既存があればスキップ）
do $$ begin
  if not exists (select 1 from pg_policies where tablename='users' and policyname='users: own row') then
    create policy "users: own row" on users for all using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='diary_entries' and policyname='diary: own rows') then
    create policy "diary: own rows" on diary_entries for all using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='daily_summaries' and policyname='summaries: own rows') then
    create policy "summaries: own rows" on daily_summaries for all using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='user_profile_summary' and policyname='profile: own row') then
    create policy "profile: own row" on user_profile_summary for all using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='character_evolution' and policyname='evolution: own row') then
    create policy "evolution: own row" on character_evolution for all using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='streaks' and policyname='streaks: own row') then
    create policy "streaks: own row" on streaks for all using (auth.uid() = user_id);
  end if;
end $$;
