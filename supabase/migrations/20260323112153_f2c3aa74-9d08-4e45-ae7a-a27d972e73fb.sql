CREATE OR REPLACE FUNCTION public.get_captains_count()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::integer
  FROM public.user_roles
  WHERE role = 'captain';
$$;