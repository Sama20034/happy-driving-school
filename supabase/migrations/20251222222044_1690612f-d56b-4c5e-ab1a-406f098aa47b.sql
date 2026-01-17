-- Add display_order column to countries
ALTER TABLE public.countries ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Add display_order column to governorates
ALTER TABLE public.governorates ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Add display_order column to branches
ALTER TABLE public.branches ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Set initial order based on creation date for existing records
UPDATE public.countries SET display_order = subq.rn FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM public.countries) as subq WHERE countries.id = subq.id;

UPDATE public.governorates SET display_order = subq.rn FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM public.governorates) as subq WHERE governorates.id = subq.id;

UPDATE public.branches SET display_order = subq.rn FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM public.branches) as subq WHERE branches.id = subq.id;