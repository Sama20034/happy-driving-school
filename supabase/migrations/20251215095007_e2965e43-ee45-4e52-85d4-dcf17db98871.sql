-- Create table for captain availability schedule
CREATE TABLE public.captain_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_id uuid NOT NULL REFERENCES public.captains(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 60,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (captain_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.captain_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read captain availability"
ON public.captain_availability
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert captain availability"
ON public.captain_availability
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update captain availability"
ON public.captain_availability
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete captain availability"
ON public.captain_availability
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment
COMMENT ON TABLE public.captain_availability IS 'Stores available time slots for each captain per day of week';