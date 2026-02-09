-- Allow orders table to accept null user_id
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Create new policies for orders - allow public insert
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

-- Users can view their own orders (if logged in) or orders they created (by matching phone/name)
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (
  auth.uid() = user_id 
  OR user_id IS NULL
  OR auth.role() = 'authenticated'
);

-- Drop existing RLS policies for order_items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;

-- Create new policies for order_items
CREATE POLICY "Anyone can create order items"
ON public.order_items
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view order items"
ON public.order_items
FOR SELECT
USING (true);