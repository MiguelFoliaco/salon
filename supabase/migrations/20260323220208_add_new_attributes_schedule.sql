-- Si estado de la cita no ha cambiado de pending a confirmed en 15 minutos, cancelar la cita. Este estado cambia cuando el usuario realiza el pago.
alter table schedules add column expires_at timestamptz not null default now() + interval '15 minutes';
