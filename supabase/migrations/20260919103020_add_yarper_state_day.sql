alter table public.yarper_state add column if not exists state_day date not null default current_date;
