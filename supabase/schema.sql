create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

create policy "Allow all" on tasks for all using (true) with check (true);
