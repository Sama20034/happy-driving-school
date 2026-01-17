-- Add approval status and document URLs to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS id_card_url text,
ADD COLUMN IF NOT EXISTS personal_photo_url text,
ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all user documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to view all profiles for approval
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update profiles (for approval)
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update handle_new_user to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Create profile with pending approval
  INSERT INTO public.profiles (id, user_id, full_name, is_approved, approval_status)
  VALUES (
    gen_random_uuid(), 
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    false,
    'pending'
  );
  
  -- Get role from metadata, default to 'trainee' if not specified
  user_role := COALESCE(
    (NEW.raw_user_meta_data ->> 'user_role')::app_role,
    'trainee'::app_role
  );
  
  -- Don't allow signing up as admin through the app
  IF user_role = 'admin' THEN
    user_role := 'trainee';
  END IF;
  
  -- Assign user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;