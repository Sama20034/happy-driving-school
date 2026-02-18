
CREATE OR REPLACE FUNCTION public.check_license_expiry()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  captain RECORD;
  admin_user RECORD;
  warning_date date;
  expired_license text;
BEGIN
  warning_date := CURRENT_DATE + INTERVAL '7 days';
  
  FOR captain IN
    SELECT cp.id, cp.user_id, cp.full_name, cp.status,
           cp.driving_license_expiry, cp.car_license_expiry
    FROM captain_profiles cp
    WHERE cp.status != 'banned'
  LOOP
    IF (captain.driving_license_expiry IS NOT NULL AND captain.driving_license_expiry <= CURRENT_DATE)
       OR (captain.car_license_expiry IS NOT NULL AND captain.car_license_expiry <= CURRENT_DATE)
    THEN
      IF captain.status != 'suspended' THEN
        UPDATE captain_profiles SET status = 'suspended', is_available = false WHERE id = captain.id;
        
        -- Determine which license expired
        expired_license := '';
        IF captain.driving_license_expiry IS NOT NULL AND captain.driving_license_expiry <= CURRENT_DATE THEN
          expired_license := 'رخصة القيادة';
        END IF;
        IF captain.car_license_expiry IS NOT NULL AND captain.car_license_expiry <= CURRENT_DATE THEN
          IF expired_license != '' THEN
            expired_license := expired_license || ' و ';
          END IF;
          expired_license := expired_license || 'رخصة السيارة';
        END IF;
        
        -- Notify the captain
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
          captain.user_id,
          'تم تعليق حسابك',
          'تم تعليق حسابك تلقائياً بسبب انتهاء صلاحية ' || expired_license || '. يرجى تجديد الرخصة وتحديث التاريخ لإعادة تفعيل حسابك.',
          'warning'
        );
        
        -- Notify all admins
        FOR admin_user IN
          SELECT user_id FROM user_roles WHERE role = 'admin'
        LOOP
          INSERT INTO notifications (user_id, title, message, type, related_id)
          VALUES (
            admin_user.user_id,
            'تعليق كابتن تلقائي',
            'تم تعليق حساب الكابتن "' || captain.full_name || '" تلقائياً بسبب انتهاء ' || expired_license || '.',
            'warning',
            captain.id
          );
        END LOOP;
      END IF;
      
    ELSIF (captain.driving_license_expiry IS NOT NULL AND captain.driving_license_expiry <= warning_date AND captain.driving_license_expiry > CURRENT_DATE)
       OR (captain.car_license_expiry IS NOT NULL AND captain.car_license_expiry <= warning_date AND captain.car_license_expiry > CURRENT_DATE)
    THEN
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
