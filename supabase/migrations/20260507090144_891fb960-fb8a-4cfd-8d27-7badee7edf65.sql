
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
-- Verify a user-scoped insert policy exists; if not, create one
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='orders'
      AND cmd='INSERT' AND policyname='Users can create own orders'
  ) THEN
    CREATE POLICY "Users can create own orders"
    ON public.orders
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
