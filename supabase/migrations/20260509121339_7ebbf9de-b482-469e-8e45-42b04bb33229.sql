
-- 1. Fix captain_profiles phone exposure: revoke phone column from anonymous users
REVOKE SELECT (phone) ON public.captain_profiles FROM anon;

-- 2. Fix orders overly permissive policy
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
-- "Users can view own orders" with (auth.uid() = user_id) remains in place

-- 3. Restrict discount codes to authenticated users
DROP POLICY IF EXISTS "Anyone can read active discount codes" ON public.discount_codes;
CREATE POLICY "Authenticated can read active discount codes"
ON public.discount_codes
FOR SELECT
TO authenticated
USING (is_active = true);

-- 4. Realtime channel access restriction
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can receive own realtime" ON realtime.messages;
CREATE POLICY "Authenticated can receive own realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Allow chat_messages topic if user participates in the conversation
  (
    realtime.topic() LIKE 'chat:%' AND EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id::text = split_part(realtime.topic(), ':', 2)
        AND (
          c.trainee_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.captain_profiles cp
            WHERE cp.id = c.captain_id AND cp.user_id = auth.uid()
          )
        )
    )
  )
  -- Allow notifications topic scoped to user id
  OR (
    realtime.topic() LIKE 'notifications:%'
    AND split_part(realtime.topic(), ':', 2) = auth.uid()::text
  )
  -- Allow generic public topics (no sensitive data)
  OR realtime.topic() LIKE 'public:%'
);

-- 5. Storage: deposit-images DELETE/UPDATE policies for owners
CREATE POLICY "Users can delete own deposit images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'deposit-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own deposit images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'deposit-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 6. Storage: allow captains to upload their own images
CREATE POLICY "Captains can upload own captain images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'captains'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Captains can update own captain images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'captains'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Captains can delete own captain images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'captains'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);
