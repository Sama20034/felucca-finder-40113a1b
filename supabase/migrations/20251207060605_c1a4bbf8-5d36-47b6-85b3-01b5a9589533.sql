-- إضافة عمود badge لجدول المنتجات
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge text DEFAULT NULL;