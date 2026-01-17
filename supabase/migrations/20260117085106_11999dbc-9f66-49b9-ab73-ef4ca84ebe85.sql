-- Add new roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'captain';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'trainee';

-- Update the handle_new_user function to accept role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, user_id, full_name)
  VALUES (gen_random_uuid(), NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
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
$function$;