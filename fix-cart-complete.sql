-- إصلاح شامل لمشكلة السلة
-- نفذ هذا السكريبت في Supabase SQL Editor

-- 1. حذف جميع البيانات الحالية من cart_items (للتأكد من عدم وجود تعارض)
TRUNCATE TABLE public.cart_items CASCADE;

-- 2. حذف العمود القديم product_id
ALTER TABLE public.cart_items DROP COLUMN IF EXISTS product_id CASCADE;

-- 3. إضافة العمود الجديد product_id بنوع BIGINT (ليطابق products.id)
ALTER TABLE public.cart_items 
ADD COLUMN product_id BIGINT NOT NULL;

-- 4. إنشاء foreign key constraint بشكل صحيح
ALTER TABLE public.cart_items
ADD CONSTRAINT cart_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE CASCADE;

-- 5. إنشاء index لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- 6. إعادة إنشاء unique constraint
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

ALTER TABLE public.cart_items
ADD CONSTRAINT cart_items_user_id_product_id_key 
UNIQUE(user_id, product_id);

-- 7. Refresh schema cache لـ PostgREST
NOTIFY pgrst, 'reload schema';

-- 8. التحقق من أن العلاقة تم إنشاؤها بنجاح
SELECT 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'cart_items'
  AND kcu.column_name = 'product_id';
