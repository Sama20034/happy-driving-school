
-- Fix order_items: remove overly permissive policies
DROP POLICY IF EXISTS "Users can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Fix notifications: restrict insert to own user_id
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "Users can create own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix profiles: require authentication to view captain profiles
DROP POLICY IF EXISTS "Anyone can view approved captain profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view approved captain profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (approval_status = 'approved');
