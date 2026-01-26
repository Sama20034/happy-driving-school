-- Create cron job to keep Supabase alive every 4 days
SELECT
  cron.schedule(
    'keep-supabase-alive',
    '0 0 */4 * *',
    $$
    SELECT
      net.http_post(
          url:='https://xrmcjkbbvgyjplxlmhch.supabase.co/functions/v1/keep-alive',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybWNqa2Jidmd5anBseGxtaGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MjE0ODMsImV4cCI6MjA4NDE5NzQ4M30.hgg9YNtSSlcXc-e9inDyPWs71QlusARDH3Y0TeQneK0"}'::jsonb,
          body:=concat('{"time": "', now(), '"}')::jsonb
      ) as request_id;
    $$
  );