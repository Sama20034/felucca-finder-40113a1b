-- إضافة حقل نقاط الولاء للمنتجات
-- هذا الحقل يحدد عدد النقاط المطلوبة لاستبدال المنتج
-- إذا كانت القيمة NULL أو 0، فالمنتج غير متاح للاستبدال بالنقاط

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS loyalty_points INTEGER CHECK (loyalty_points >= 0);

COMMENT ON COLUMN public.products.loyalty_points IS 'عدد النقاط المطلوبة لاستبدال المنتج. NULL أو 0 = غير متاح للاستبدال';
