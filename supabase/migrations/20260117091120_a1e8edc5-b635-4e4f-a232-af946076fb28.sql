-- Add captain-specific document columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS car_license_url text,
ADD COLUMN IF NOT EXISTS driving_license_url text,
ADD COLUMN IF NOT EXISTS car_photo_url text;