-- إنشاء جدول قائمة الأمنيات (Wishlist)
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- إنشاء Index للأداء
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON public.wishlist(product_id);

-- تفعيل RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدمين بمشاهدة قائمة أمنياتهم
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

-- السماح للمستخدمين بإضافة منتجات لقائمة أمنياتهم
CREATE POLICY "Users can insert to own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- السماح للمستخدمين بحذف منتجات من قائمة أمنياتهم
CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.wishlist IS 'قائمة الأمنيات للمستخدمين';
