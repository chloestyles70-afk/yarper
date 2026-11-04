
create policy "Yarper API only - no direct couple access" on public.yarper_couples
  for all to anon, authenticated using (false) with check (false);

create policy "Yarper API only - no direct member access" on public.yarper_members
  for all to anon, authenticated using (false) with check (false);

create policy "Yarper API only - no direct state access" on public.yarper_state
  for all to anon, authenticated using (false) with check (false);
