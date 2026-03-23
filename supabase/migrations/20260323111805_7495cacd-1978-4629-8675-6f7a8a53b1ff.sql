CREATE OR REPLACE FUNCTION public.get_satisfied_trainees_count()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::integer
  FROM public.user_roles
  WHERE role = 'trainee';
$$;