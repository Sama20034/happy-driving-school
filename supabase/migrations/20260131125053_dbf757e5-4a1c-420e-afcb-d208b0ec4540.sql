
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
  is_trainee boolean;
BEGIN
  -- Get role from metadata, default to 'trainee' if not specified
  user_role := COALESCE(
    (NEW.raw_user_meta_data ->> 'user_role')::app_role,
    'trainee'::app_role
  );
  
  -- Don't allow signing up as admin through the app
  IF user_role = 'admin' THEN
    user_role := 'trainee';
  END IF;
  
  -- Check if user is a trainee (auto-approve) or captain (needs approval)
  is_trainee := (user_role = 'trainee');
  
  -- Create profile - auto-approve trainees, pending for captains
  INSERT INTO public.profiles (id, user_id, full_name, is_approved, approval_status)
  VALUES (
    gen_random_uuid(), 
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    is_trainee,  -- true for trainees, false for captains
    CASE WHEN is_trainee THEN 'approved' ELSE 'pending' END
  );
  
  -- Assign user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;
