
-- Make booking_id nullable to allow direct conversations
ALTER TABLE public.chat_conversations ALTER COLUMN booking_id DROP NOT NULL;

-- Drop the unique constraint on booking_id to allow multiple conversations
ALTER TABLE public.chat_conversations DROP CONSTRAINT IF EXISTS chat_conversations_booking_id_fkey;

-- Re-add the foreign key but allow nulls
ALTER TABLE public.chat_conversations 
  ADD CONSTRAINT chat_conversations_booking_id_fkey 
  FOREIGN KEY (booking_id) REFERENCES captain_bookings(id);

-- Add unique constraint on captain_id + trainee_id for direct conversations (where booking_id is null)
CREATE UNIQUE INDEX IF NOT EXISTS unique_direct_conversation 
  ON public.chat_conversations (captain_id, trainee_id) 
  WHERE booking_id IS NULL;
