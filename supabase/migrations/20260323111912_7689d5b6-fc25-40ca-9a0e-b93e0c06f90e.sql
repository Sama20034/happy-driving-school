CREATE OR REPLACE FUNCTION public.get_successful_bookings_count()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::integer
  FROM public.captain_bookings
  WHERE status IN ('completed', 'confirmed');
$$;