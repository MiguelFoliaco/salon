create type employe_gender_enum as enum ('male', 'female', 'other');


alter table employes add column photo text;
alter table employes add column  gender employe_gender_enum default 'male';