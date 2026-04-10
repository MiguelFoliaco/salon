
create type purchase_status_enum as enum ('pending', 'completed', 'in_progress', 'on_the_way', 'cancelled');

-- Esta tabla es unicamente para registrar las compras de productos o productos y servicios
create table public.purchases (
    id uuid primary key default gen_random_uuid(),
    client_id uuid references public.clients(id) on delete cascade,
    service_id uuid references public.products(id) on delete cascade, -- esto si se realiza un servicio y se añaden productos
    shedule_id uuid references public.schedules(id) on delete cascade, -- esto si se realiza un servicio
    products jsonb not null, -- array de productos
    total_amount numeric(12,2) not null,
    reference_code varchar(100) unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    status purchase_status_enum default 'pending',
    address_delivery text not null,
    city_delivery varchar(100) not null,
    department_delivery varchar(100) not null,
    country_delivery varchar(100) not null default 'Colombia',
    latitude_delivery numeric(10,8),
    longitude_delivery numeric(11,8)
);

alter type employe_rol_enum add value 'delivery';

create table public.delivery(
    id uuid primary key default gen_random_uuid(),
    purchase_id uuid references public.purchases(id) on delete cascade,
    deliver_id uuid references public.employes(id) on delete cascade,
    estimate_start_time timestamptz not null,
    estimate_end_time timestamptz not null,
    actual_start_time timestamptz,
    actual_end_time timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
)