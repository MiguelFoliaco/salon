create or replace function get_unique_clients()
returns table (id uuid, auth_id uuid)
as $$
  select distinct on (auth_id) id, auth_id
  from clients
$$ language sql;