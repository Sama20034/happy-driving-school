
-- Schedule daily license expiry check at 6:00 AM UTC
SELECT cron.schedule(
  'check-license-expiry-daily',
  '0 6 * * *',
  $$SELECT public.check_license_expiry()$$
);
