-- Inventarios


CREATE TYPE inventory_movement_type_enum AS ENUM (
  'in',        -- entrada (compra, reposición)
  'out',       -- salida (venta)
  'adjustment' -- ajuste manual
);

CREATE TABLE public.inventory_by_branch (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  min_stock integer DEFAULT 0,
  max_stock integer,
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT inventory_by_branch_pkey PRIMARY KEY (id),

  CONSTRAINT inventory_by_branch_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id),

  CONSTRAINT inventory_by_branch_branch_id_fkey 
    FOREIGN KEY (branch_id) REFERENCES public.branches(id),

  CONSTRAINT inventory_unique UNIQUE (product_id, branch_id)
);


CREATE TABLE public.inventory_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  quantity integer NOT NULL,
  movement_type inventory_movement_type_enum NOT NULL, -- entrada, salida, ajuste
  reference_id uuid, -- opcional (venta, compra, ajuste manual)
  notes text,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT inventory_movements_pkey PRIMARY KEY (id),

  CONSTRAINT inventory_movements_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id),

  CONSTRAINT inventory_movements_branch_id_fkey 
    FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);


CREATE TABLE public.transaction_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  product_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,

  CONSTRAINT transaction_items_pkey PRIMARY KEY (id),

  CONSTRAINT transaction_items_transaction_id_fkey 
    FOREIGN KEY (transaction_id) REFERENCES public.transactions(id),

  CONSTRAINT transaction_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id),

  CONSTRAINT transaction_items_branch_id_fkey 
    FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);

CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  address text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  supplier_id uuid,
  branch_id uuid NOT NULL,
  total_amount numeric,
  products jsonb,
  services jsonb,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT purchases_pkey PRIMARY KEY (id),

  CONSTRAINT purchases_supplier_id_fkey 
    FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),

  CONSTRAINT purchases_branch_id_fkey 
    FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);

CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  description text,
  logo text,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT brands_pkey PRIMARY KEY (id)
);

ALTER TABLE public.products
ADD COLUMN brand_id uuid;

ALTER TABLE public.products
ADD CONSTRAINT products_brand_id_fkey
FOREIGN KEY (brand_id) REFERENCES public.brands(id);

CREATE INDEX idx_products_brand_id
ON public.products(brand_id);

--- imagenes para los productos

create table public.product_gallery (
  id uuid not null default gen_random_uuid(),
  product_id uuid not null,
  image_url text not null,
  alt text,
  created_at timestamp with time zone default now(),

  constraint product_images_pkey primary key (id),

  constraint product_images_product_id_fkey 
    foreign key (product_id) references public.products(id)
);