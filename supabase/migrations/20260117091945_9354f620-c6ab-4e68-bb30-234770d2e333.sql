-- Add captain-specific fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS car_type text,
ADD COLUMN IF NOT EXISTS transmission_type text,
ADD COLUMN IF NOT EXISTS training_governorate_id uuid REFERENCES public.governorates(id);