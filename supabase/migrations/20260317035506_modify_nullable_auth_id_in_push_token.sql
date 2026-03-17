-- Vuelvo el auth_id nullable ya que puede que el que use la app aun no tenga sessión
alter table public.push_token_device_x_user
alter column auth_id drop not null;

alter table public.push_token_device_x_user
alter column auth_id set default null;
