
-- Add license expiry date columns to captain_profiles
ALTER TABLE public.captain_profiles
ADD COLUMN driving_license_expiry date NULL,
ADD COLUMN car_license_expiry date NULL;

-- Create function to check license expiry and auto-suspend/warn
CREATE OR REPLACE FUNCTION public.check_license_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  captain RECORD;
  warning_date date;
BEGIN
  warning_date := CURRENT_DATE + INTERVAL '7 days';
  
  FOR captain IN
    SELECT cp.id, cp.user_id, cp.full_name, cp.status,
           cp.driving_license_expiry, cp.car_license_expiry
    FROM captain_profiles cp
    WHERE cp.status != 'banned'
  LOOP
    -- Check if any license is expired today or before
    IF (captain.driving_license_expiry IS NOT NULL AND captain.driving_license_expiry <= CURRENT_DATE)
       OR (captain.car_license_expiry IS NOT NULL AND captain.car_license_expiry <= CURRENT_DATE)
    THEN
      -- Suspend the captain if not already suspended
      IF captain.status != 'suspended' THEN
        UPDATE captain_profiles SET status = 'suspended', is_available = false WHERE id = captain.id;
        
        -- Send notification about suspension
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
          captain.user_id,
          'تم تعليق حسابك',
          'تم تعليق حسابك تلقائياً بسبب انتهاء صلاحية إحدى رخصك. يرجى تجديد الرخصة وتحديث التاريخ لإعادة تفعيل حسابك.',
          'warning'
        );
      END IF;
      
    -- Check if license expires within 7 days (warning)
    ELSIF (captain.driving_license_expiry IS NOT NULL AND captain.driving_license_expiry <= warning_date AND captain.driving_license_expiry > CURRENT_DATE)
       OR (captain.car_license_expiry IS NOT NULL AND captain.car_license_expiry <= warning_date AND captain.car_license_expiry > CURRENT_DATE)
    THEN
      -- Send warning notification (only if not already sent today)
      IF NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE user_id = captain.user_id
          AND type = 'warning'
          AND title = 'تحذير: رخصتك على وشك الانتهاء'
          AND created_at::date = CURRENT_DATE
      ) THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
          captain.user_id,
          'تحذير: رخصتك على وشك الانتهاء',
          'إحدى رخصك ستنتهي خلال أسبوع. يرجى تجديدها وتحديث التاريخ في ملفك الشخصي لتجنب تعليق حسابك.',
          'warning'
        );
      END IF;
    END IF;
  END LOOP;
END;
$$;
