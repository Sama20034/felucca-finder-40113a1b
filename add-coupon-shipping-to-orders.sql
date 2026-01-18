-- إضافة حقول الكوبون والشحن إلى جدول orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_zone_id UUID REFERENCES public.shipping_zones(id);

-- إضافة index للأداء
CREATE INDEX IF NOT EXISTS idx_orders_coupon ON public.orders(coupon_code);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_zone ON public.orders(shipping_zone_id);

COMMENT ON COLUMN public.orders.discount_amount IS 'قيمة الخصم المطبق على الطلب';
COMMENT ON COLUMN public.orders.coupon_code IS 'كود الكوبون المستخدم';
COMMENT ON COLUMN public.orders.shipping_zone_id IS 'منطقة الشحن المختارة';
