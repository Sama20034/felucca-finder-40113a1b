-- إنشاء جدول السلة (cart_items)
-- نفذ هذا السكريبت في Supabase SQL Editor

-- 1. إنشاء جدول cart_items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- 2. إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- 3. إنشاء أو التأكد من وجود دالة update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. إنشاء Trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- 5. تفعيل Row Level Security (RLS)
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 6. حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

-- 7. إنشاء RLS Policies

-- السماح للمستخدمين بمشاهدة عناصر سلتهم فقط
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- السماح للمستخدمين بإضافة عناصر لسلتهم الخاصة
CREATE POLICY "Users can insert their own cart items"
ON public.cart_items
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- السماح للمستخدمين بتحديث عناصر سلتهم الخاصة
CREATE POLICY "Users can update their own cart items"
ON public.cart_items
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- السماح للمستخدمين بحذف عناصر من سلتهم الخاصة
CREATE POLICY "Users can delete their own cart items"
ON public.cart_items
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 8. Refresh schema cache لـ PostgREST
NOTIFY pgrst, 'reload schema';

-- 9. التحقق من نجاح الإنشاء
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'cart_items'
ORDER BY ordinal_position;
