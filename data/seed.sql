-- ========================
-- PRODUCT TYPES
-- ========================
insert into product_types (id, name, description) values
('11111111-1111-1111-1111-111111111111', 'service', 'Salon services'),
('22222222-2222-2222-2222-222222222222', 'product', 'Physical products');


-- ========================
-- TAXES
-- ========================
insert into taxes (id, name, code, percentage) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'IVA 19%', 'IVA19', 19.00);


-- ========================
-- CONFIGURATION (COMPANY)
-- ========================
insert into configurations (
    id, company_name, trade_name, nit, code_verification_nit,
    email, phone, address, city, department,
    dian_resolution_number, dian_resolution_date,
    invoice_prefix, invoice_from, invoice_to
) values (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Beauty Style SAS',
    'Beauty Style',
    '901234567',
    '3',
    'info@beautystyle.com',
    '3001234567',
    'Cra 10 #20-30',
    'Bogotá',
    'Cundinamarca',
    '18764012345678',
    '2024-01-01',
    'BS',
    1,
    5000
);


-- ========================
-- BRANCHES
-- ========================
insert into branches (id, configuration_id, name, address, city, phone, email) values
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'Main Branch', 'Cra 10 #20-30', 'Bogotá', '3001234567', 'sede@beautystyle.com'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'North Branch', 'Av 68 #100-20', 'Bogotá', '3007654321', 'norte@beautystyle.com');


-- ========================
-- CLIENTS
-- ========================
insert into clients (
    id, auth_id, identity_type, identity_value,
    name, lastname, lastname_2, phone,
    client_type, code_verification, address, email
) values
(
 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
 '00000000-0000-0000-0000-000000000001', -- replace with real auth.users id
 'DNI', '10203040',
 'Maria', 'Gomez', 'Lopez', '3105551111',
 'natural', null, 'Calle 80 #45-20', 'maria@gmail.com'
),
(
 'ffffffff-ffff-ffff-ffff-ffffffffffff',
 '00000000-0000-0000-0000-000000000002', -- replace with real auth.users id
 'ID', '900123456',
 'Empresa', 'Salon', 'SAS', '3204442222',
 'juridico', '1', 'Zona Industrial', 'contabilidad@empresa.com'
);


-- ========================
-- PRODUCTS & SERVICES
-- ========================
insert into products (
    id, product_type_id, name, description,
    value, stock, code, tax_id
) values
(
 '99999999-9999-9999-9999-999999999999',
 '11111111-1111-1111-1111-111111111111',
 'Haircut',
 'Basic haircut service',
 30000, null, 'SERV001',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),
(
 '88888888-8888-8888-8888-888888888888',
 '11111111-1111-1111-1111-111111111111',
 'Manicure',
 'Manicure service',
 25000, null, 'SERV002',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),
(
 '77777777-7777-7777-7777-777777777777',
 '22222222-2222-2222-2222-222222222222',
 'Shampoo',
 'Hair shampoo product',
 45000, 50, 'PROD001',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);


-- ========================
-- SCHEDULES
-- ========================
insert into schedules (
    id, client_id, product_id, branch_id,
    start_time, end_time, status, notes
) values
(
 '12121212-1212-1212-1212-121212121212',
 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
 '99999999-9999-9999-9999-999999999999',
 'cccccccc-cccc-cccc-cccc-cccccccccccc',
 '2026-03-05 09:00:00-05',
 '2026-03-05 09:30:00-05',
 'confirmed',
 'First visit'
),
(
 '13131313-1313-1313-1313-131313131313',
 'ffffffff-ffff-ffff-ffff-ffffffffffff',
 '88888888-8888-8888-8888-888888888888',
 'dddddddd-dddd-dddd-dddd-dddddddddddd',
 '2026-03-05 10:00:00-05',
 '2026-03-05 10:45:00-05',
 'pending',
 'Corporate service'
);


-- ========================
-- TRANSACTIONS
-- ========================
insert into transactions (
    id, schedule_id, client_id,
    transaction_type, amount,
    tax_amount, total_amount,
    payment_method, reference_code
) values
(
 'abababab-abab-abab-abab-abababababab',
 '12121212-1212-1212-1212-121212121212',
 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
 'income',
 30000,
 5700,
 35700,
 'cash',
 'INV-001'
),
(
 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd',
 '13131313-1313-1313-1313-131313131313',
 'ffffffff-ffff-ffff-ffff-ffffffffffff',
 'income',
 25000,
 4750,
 29750,
 'transfer',
 'INV-002'
);


-- ========================
-- AUDIT LOGS (example)
-- ========================
insert into audit_logs (
    table_name, record_id, action, new_data, user_id
) values (
    'clients',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'INSERT',
    '{"name":"Maria","lastname":"Gomez"}',
    '00000000-0000-0000-0000-000000000001'
);