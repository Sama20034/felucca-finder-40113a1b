-- إصلاح مشكلة foreign key relationship بين cart_items و products
-- نفذ هذا السكريبت في Supabase SQL Editor

-- 1. حذف الـ foreign key القديم (إن وجد)
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

-- 2. إعادة إنشاء الـ foreign key بشكل صحيح
ALTER TABLE public.cart_items
ADD CONSTRAINT cart_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE CASCADE;

-- 3. Refresh schema cache
NOTIFY pgrst, 'reload schema';
