-- Create countries table
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for countries
CREATE POLICY "Anyone can read countries" 
ON public.countries 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert countries" 
ON public.countries 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update countries" 
ON public.countries 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete countries" 
ON public.countries 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add country_id to governorates
ALTER TABLE public.governorates 
ADD COLUMN country_id UUID REFERENCES public.countries(id);

-- Insert Egypt as default country
INSERT INTO public.countries (name, code) VALUES ('مصر', 'EG');

-- Update existing governorates to link to Egypt
UPDATE public.governorates 
SET country_id = (SELECT id FROM public.countries WHERE code = 'EG' LIMIT 1);