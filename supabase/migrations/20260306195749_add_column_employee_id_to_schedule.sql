alter table schedules add column employee_id uuid;
alter table schedules add constraint schedule_employee_id_fkey foreign key (employee_id) references employes(id);