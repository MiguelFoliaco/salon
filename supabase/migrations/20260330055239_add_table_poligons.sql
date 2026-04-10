create table polygons_coverage(
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    points jsonb not null,
    price decimal(10,2) not null,
    branch_id uuid not null references branches(id) on delete cascade,
    is_active boolean default true,
    color text default '#ff0000',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
); -- Falta migrar