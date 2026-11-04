create index if not exists yarper_rate_limits_window_start_idx
 on private.yarper_rate_limits(window_start);

drop policy if exists service_role_rate_limit_access on private.yarper_rate_limits;
create policy service_role_rate_limit_access
 on private.yarper_rate_limits
 for all to service_role
 using (true)
 with check (true);
