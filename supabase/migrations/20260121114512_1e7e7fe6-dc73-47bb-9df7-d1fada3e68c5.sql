-- Add meeting_point column to profiles table for trainees
ALTER TABLE public.profiles 
ADD COLUMN meeting_point text;