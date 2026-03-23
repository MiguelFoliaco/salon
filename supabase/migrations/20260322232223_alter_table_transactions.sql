drop table public.purchases;

create type transaction_status_enum as enum ('pending', 'completed', 'cancelled');

alter table transactions add column products jsonb;
alter table transactions add column services jsonb;
alter table transactions add column branch_id uuid references branches(id);
alter table transactions add column status transaction_status_enum default 'pending';
