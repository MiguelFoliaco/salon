create table public.push_token_device_x_user(
    id uuid primary key default uuid_generate_v4(),
    device_id text not null,
    push_token text not null,
    auth_id  uuid not null references auth.users (id),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
)