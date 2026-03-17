create type notification_type as enum (
    'PRODUCT',
    'SERVICE',
    'PROMOTION',
    'LOCATION',
    'BRANCH'
);

create table notification (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    image text,
    data jsonb,
    type notification_type not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
)