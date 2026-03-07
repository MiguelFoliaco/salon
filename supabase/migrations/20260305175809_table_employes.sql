create type employe_rol_enum as enum ('admin', 'cashier', 'stylist');

create table employes (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    last_name text not null,
    auth_id uuid not null references auth.users(id) on delete cascade,
    phone text,
    address text,
    title text, -- cargo del trabajador
    is_active boolean default true,
    is_fashionist boolean default false,
    rol employe_rol_enum default 'stylist',
    hours_available jsonb,
    services_available uuid[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
)