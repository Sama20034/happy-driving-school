-- Fix the existing verified booking and create conversation
UPDATE captain_bookings 
SET status = 'confirmed' 
WHERE payment_status = 'verified' AND status = 'pending';

-- Create conversations for all verified bookings that don't have one
INSERT INTO chat_conversations (booking_id, captain_id, trainee_id)
SELECT id, captain_id, trainee_id 
FROM captain_bookings 
WHERE payment_status = 'verified' 
  AND NOT EXISTS (
    SELECT 1 FROM chat_conversations cc WHERE cc.booking_id = captain_bookings.id
  );