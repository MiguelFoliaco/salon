alter table "public"."employes" drop column "services_available";

create table public.services_x_employee (
    id uuid default uuid_generate_v4() primary key,
    employee_id uuid references public.employes(id) on delete cascade,
    service_id uuid references public.products(id) on delete cascade
);