-- تفعيل pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- إنشاء function للحفاظ على قاعدة البيانات نشطة
CREATE OR REPLACE FUNCTION public.keep_database_alive()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- استعلام بسيط للحفاظ على النشاط
  PERFORM COUNT(*) FROM products;
  RAISE LOG 'Keep-alive ping executed at %', NOW();
END;
$$;

-- جدولة المهمة كل 3 أيام
SELECT cron.schedule(
  'keep-alive-job',
  '0 12 */3 * *',  -- كل 3 أيام الساعة 12 ظهراً
  $$SELECT public.keep_database_alive()$$
);