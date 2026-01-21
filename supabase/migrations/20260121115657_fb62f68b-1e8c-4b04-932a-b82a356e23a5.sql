-- Add payment confirmation columns to captain_bookings
ALTER TABLE public.captain_bookings 
ADD COLUMN IF NOT EXISTS captain_confirmed_payment boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS captain_confirmed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS trainee_confirmed_payment boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trainee_confirmed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS remaining_amount numeric GENERATED ALWAYS AS (total_price - COALESCE(deposit_amount, 0)) STORED;

-- Add comment to explain the columns
COMMENT ON COLUMN public.captain_bookings.captain_confirmed_payment IS 'Captain confirms receiving the remaining payment';
COMMENT ON COLUMN public.captain_bookings.trainee_confirmed_payment IS 'Trainee confirms paying the remaining amount';