
-- Fix the function search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix the overly permissive notifications INSERT policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications" ON public.notifications 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
