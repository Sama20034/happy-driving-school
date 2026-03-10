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
  user_role := COALESCE(
    (NEW.raw_user_meta_data ->> 'user_role')::app_role,
    'trainee'::app_role
  );
  
  IF user_role = 'admin' THEN
    user_role := 'trainee';
  END IF;
  
  is_trainee := (user_role = 'trainee');
  
  INSERT INTO public.profiles (id, user_id, full_name, phone, is_approved, approval_status)
  VALUES (
    gen_random_uuid(), 
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    is_trainee,
    CASE WHEN is_trainee THEN 'approved' ELSE 'pending' END
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;