-- Create table for captain course pricing
CREATE TABLE public.captain_course_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captain_id UUID NOT NULL REFERENCES public.captain_profiles(id) ON DELETE CASCADE,
  course_type TEXT NOT NULL CHECK (course_type IN ('practice', 'beginner', 'professional')),
  session_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(captain_id, course_type)
);

-- Enable RLS
ALTER TABLE public.captain_course_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view captain course prices"
ON public.captain_course_prices
FOR SELECT
USING (true);

CREATE POLICY "Captains can insert own course prices"
ON public.captain_course_prices
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM captain_profiles
    WHERE captain_profiles.id = captain_course_prices.captain_id
    AND captain_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Captains can update own course prices"
ON public.captain_course_prices
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM captain_profiles
    WHERE captain_profiles.id = captain_course_prices.captain_id
    AND captain_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Captains can delete own course prices"
ON public.captain_course_prices
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM captain_profiles
    WHERE captain_profiles.id = captain_course_prices.captain_id
    AND captain_profiles.user_id = auth.uid()
  )
);

-- Trigger to update updated_at
CREATE TRIGGER update_captain_course_prices_updated_at
BEFORE UPDATE ON public.captain_course_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();