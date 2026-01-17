-- Add RLS policies for admins to manage captain_bookings
CREATE POLICY "Admins can view all captain bookings" 
ON public.captain_bookings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all captain bookings" 
ON public.captain_bookings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Make deposit-images bucket public so images can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'deposit-images';