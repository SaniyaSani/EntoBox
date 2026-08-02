-- Future PostgreSQL / Supabase schema notes. Not used by the local-first EntoBox V4 beta.
-- Apply after the V2 schema or adapt the table names to an existing collection database.

-- V3.4 explicit storage hierarchy. Every building, room, cabinet, drawer,
-- shelf, freezer, and specimen box can be represented as a linked location.
alter table locations
  add column if not exists parent_location_id uuid references locations(id) on delete restrict,
  add column if not exists location_type text default 'custom',
  add column if not exists location_code text,
  add column if not exists location_notes text;

create index if not exists locations_parent_idx on locations(parent_location_id);
create index if not exists locations_type_idx on locations(location_type);

alter table specimens
  add column if not exists target_box_id uuid references locations(id) on delete set null,
  add column if not exists position_x numeric(6,3),
  add column if not exists position_y numeric(6,3),
  add column if not exists footprint_width_mm numeric(8,2),
  add column if not exists footprint_height_mm numeric(8,2),
  add column if not exists zone_id uuid,
  add column if not exists photo_thumbnail_url text;

alter table locations
  add column if not exists physical_width_mm numeric(8,2),
  add column if not exists physical_height_mm numeric(8,2),
  add column if not exists map_background_url text,
  add column if not exists map_grid_columns integer default 16,
  add column if not exists map_grid_rows integer default 12;

create table if not exists box_zones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  box_id uuid not null references locations(id) on delete cascade,
  name text not null,
  code text,
  description text,
  position_x numeric(6,3) not null,
  position_y numeric(6,3) not null,
  width_percent numeric(6,3) not null,
  height_percent numeric(6,3) not null,
  display_color integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table specimens
  drop constraint if exists specimens_zone_id_fkey;
alter table specimens
  add constraint specimens_zone_id_fkey foreign key (zone_id) references box_zones(id) on delete set null;

create index if not exists specimens_current_box_spatial_idx
  on specimens(current_location_id, position_x, position_y);
create index if not exists specimens_target_box_idx
  on specimens(target_box_id) where current_location_id is null;
create index if not exists box_zones_box_idx on box_zones(box_id);

-- Recommended validation constraints can be added after existing data is migrated:
-- check (position_x between 0 and 100)
-- check (position_y between 0 and 100)
