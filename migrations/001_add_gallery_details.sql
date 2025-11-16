-- migrations/001_add_gallery_details.sql
--
-- Adds title, description, and project_url to the gallery_items table.
--

ALTER TABLE public.gallery_items ADD COLUMN title text;
ALTER TABLE public.gallery_items ADD COLUMN description text;
ALTER TABLE public.gallery_items ADD COLUMN project_url text;
