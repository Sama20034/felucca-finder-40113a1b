-- إصلاح تحذيرات الأمان: إضافة search_path للدوال
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_number text;
  today_date text;
  sequence_num integer;
BEGIN
  today_date := to_char(current_date, 'YYYYMMDD');
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS integer)), 0) + 1
  INTO sequence_num
  FROM public.orders
  WHERE order_number LIKE 'ORD' || today_date || '%';
  new_number := 'ORD' || today_date || LPAD(sequence_num::text, 4, '0');
  RETURN new_number;
END;
$$;