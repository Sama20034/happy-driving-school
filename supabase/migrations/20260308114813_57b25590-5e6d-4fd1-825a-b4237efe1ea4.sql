CREATE OR REPLACE FUNCTION public.get_satisfied_trainees_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT trainee_id)::integer
  FROM captain_bookings
  WHERE status IN ('completed', 'confirmed');
$$;