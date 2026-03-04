create type identity_type_enum as enum ('DNI', 'PASSPORT', 'ID');
create type client_type_enum as enum ('natural', 'juridico');
create type product_type_enum as enum ('service', 'product');
create type schedule_status_enum as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type transaction_type_enum as enum ('income', 'expense');
create type payment_method_enum as enum ('cash', 'card', 'transfer', 'nequi', 'daviplata', 'other');


create table clients (
    id uuid primary key default gen_random_uuid(),

    auth_id uuid not null references auth.users(id) on delete cascade,

    identity_type identity_type_enum not null,
    identity_value varchar(50) not null,

    name varchar(100) not null,
    lastname varchar(100) not null,
    lastname_2 varchar(100),

    phone varchar(20) not null,
    code_phone varchar(5) default '+57',

    client_type client_type_enum not null default 'natural',

    code_verification varchar(5), -- NIT DV (if juridico)

    address text,
    email varchar(150),

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    unique(identity_type, identity_value)
);


create table product_types (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null unique,
    description text,
    created_at timestamptz default now()
);

create table taxes (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null,
    code varchar(10) not null, -- DIAN code
    percentage numeric(5,2) not null,
    created_at timestamptz default now()
);


create table products (
    id uuid primary key default gen_random_uuid(),

    product_type_id uuid not null references product_types(id),

    name varchar(150) not null,
    description text,

    value numeric(12,2) not null,
    stock integer, -- nullable for services

    code varchar(50) unique,

    tax_id uuid references taxes(id),

    is_active boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


create table configurations (
    id uuid primary key default gen_random_uuid(),

    company_name varchar(200) not null,
    trade_name varchar(200),

    nit varchar(20) not null,
    code_verification_nit varchar(5) not null,

    email varchar(150),
    phone varchar(20),

    address text,
    city varchar(100),
    department varchar(100),
    country varchar(100) default 'Colombia',

    dian_resolution_number varchar(50),
    dian_resolution_date date,

    invoice_prefix varchar(10),
    invoice_from integer,
    invoice_to integer,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


create table branches (
    id uuid primary key default gen_random_uuid(),

    configuration_id uuid not null references configurations(id),

    name varchar(150) not null,
    address text not null,
    city varchar(100),
    phone varchar(20),
    email varchar(150),

    created_at timestamptz default now()
);


create table schedules (
    id uuid primary key default gen_random_uuid(),

    client_id uuid not null references clients(id),
    product_id uuid not null references products(id),
    branch_id uuid not null references branches(id),

    start_time timestamptz not null,
    end_time timestamptz not null,

    status schedule_status_enum default 'pending',

    notes text,

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    check (end_time > start_time)
);


create table transactions (
    id uuid primary key default gen_random_uuid(),

    schedule_id uuid references schedules(id),
    client_id uuid references clients(id),

    transaction_type transaction_type_enum not null,

    amount numeric(12,2) not null,

    tax_amount numeric(12,2),
    total_amount numeric(12,2) not null,

    payment_method payment_method_enum not null,

    reference_code varchar(100),

    created_at timestamptz default now()
);


create table audit_logs (
    id uuid primary key default gen_random_uuid(),
    table_name varchar(100),
    record_id uuid,
    action varchar(20), -- INSERT UPDATE DELETE
    old_data jsonb,
    new_data jsonb,
    user_id uuid references auth.users(id),
    created_at timestamptz default now()
);