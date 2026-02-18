
-- Create captain_cars table for multiple cars per captain
CREATE TABLE public.captain_cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  car_type TEXT NOT NULL,
  transmission_type TEXT NOT NULL CHECK (transmission_type IN ('manual', 'automatic')),
  car_photo_url TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.captain_cars ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view captain cars"
ON public.captain_cars FOR SELECT
USING (true);

CREATE POLICY "Captains can insert own cars"
ON public.captain_cars FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM captain_profiles
    WHERE captain_profiles.id = captain_cars.captain_id
    AND captain_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Captains can update own cars"
ON public.captain_cars FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM captain_profiles
    WHERE captain_profiles.id = captain_cars.captain_id
    AND captain_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Captains can delete own cars"
ON public.captain_cars FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM captain_profiles
    WHERE captain_profiles.id = captain_cars.captain_id
    AND captain_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all captain cars"
ON public.captain_cars FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
