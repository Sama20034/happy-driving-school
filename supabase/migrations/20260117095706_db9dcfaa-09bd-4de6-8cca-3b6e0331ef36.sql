
-- Add deposit/payment columns to captain_bookings
ALTER TABLE public.captain_bookings 
ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposit_image_url TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('instapay', 'vodafone_cash')),
ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'verified', 'rejected'));

-- Create storage bucket for deposit images
INSERT INTO storage.buckets (id, name, public)
VALUES ('deposit-images', 'deposit-images', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for deposit-images bucket
CREATE POLICY "Users can upload their own deposit images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'deposit-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own deposit images"
ON storage.objects FOR SELECT
USING (bucket_id = 'deposit-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all deposit images"
ON storage.objects FOR SELECT
USING (bucket_id = 'deposit-images' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Captains can view their booking deposit images"
ON storage.objects FOR SELECT
USING (bucket_id = 'deposit-images' AND EXISTS (
  SELECT 1 FROM public.captain_bookings cb
  JOIN public.captain_profiles cp ON cb.captain_id = cp.id
  WHERE cp.user_id = auth.uid()
  AND cb.deposit_image_url LIKE '%' || name
));
