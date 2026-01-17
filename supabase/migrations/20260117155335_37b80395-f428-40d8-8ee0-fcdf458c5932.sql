-- Allow anyone to view approved captain profiles (public visibility)
CREATE POLICY "Anyone can view approved captain profiles" 
ON public.profiles 
FOR SELECT 
USING (approval_status = 'approved');