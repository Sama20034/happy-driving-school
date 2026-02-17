
-- Add status column to captain_profiles for suspend/ban
ALTER TABLE public.captain_profiles 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Add admin DELETE policy for captain_profiles
CREATE POLICY "Admins can delete captain profiles"
ON public.captain_profiles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add admin UPDATE policy for captain_profiles
CREATE POLICY "Admins can update all captain profiles"
ON public.captain_profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));
