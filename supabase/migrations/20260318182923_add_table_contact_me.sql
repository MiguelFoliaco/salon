create table contact_me_public (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    email varchar(255) not null,
    message text not null,
    created_at timestamp default now()
);