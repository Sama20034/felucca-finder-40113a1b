-- جدول مناطق الشحن (المحافظات والمناطق)
CREATE TABLE IF NOT EXISTS public.shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('governorate', 'area')),
    parent_id UUID REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    free_shipping_threshold DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول إعدادات الشحن العامة
CREATE TABLE IF NOT EXISTS public.shipping_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 50,
    free_shipping_threshold DECIMAL(10, 2),
    is_zone_based BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- إدراج إعدادات افتراضية
INSERT INTO public.shipping_settings (default_shipping_cost, free_shipping_threshold, is_zone_based)
VALUES (50, 500, false)
ON CONFLICT DO NOTHING;

-- Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_shipping_zones_parent ON public.shipping_zones(parent_id);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_type ON public.shipping_zones(type);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_active ON public.shipping_zones(is_active);

-- تفعيل RLS
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بالقراءة
CREATE POLICY "Anyone can view active shipping zones"
  ON public.shipping_zones FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view shipping settings"
  ON public.shipping_settings FOR SELECT
  USING (true);

-- السماح للأدمن بإدارة مناطق الشحن
CREATE POLICY "Admins can manage shipping zones"
  ON public.shipping_zones FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage shipping settings"
  ON public.shipping_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_shipping_zones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shipping_zones_updated_at
    BEFORE UPDATE ON public.shipping_zones
    FOR EACH ROW
    EXECUTE FUNCTION update_shipping_zones_updated_at();

CREATE TRIGGER update_shipping_settings_updated_at
    BEFORE UPDATE ON public.shipping_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_shipping_zones_updated_at();

-- إدراج بعض المحافظات كأمثلة
INSERT INTO public.shipping_zones (name, name_ar, type, shipping_cost, free_shipping_threshold, display_order) VALUES
('Cairo', 'القاهرة', 'governorate', 50, 500, 1),
('Giza', 'الجيزة', 'governorate', 50, 500, 2),
('Alexandria', 'الإسكندرية', 'governorate', 60, 600, 3),
('Qalyubia', 'القليوبية', 'governorate', 60, 600, 4),
('Sharqia', 'الشرقية', 'governorate', 70, 700, 5),
('Dakahlia', 'الدقهلية', 'governorate', 70, 700, 6),
('Beheira', 'البحيرة', 'governorate', 70, 700, 7),
('Gharbia', 'الغربية', 'governorate', 70, 700, 8),
('Monufia', 'المنوفية', 'governorate', 70, 700, 9),
('Kafr El Sheikh', 'كفر الشيخ', 'governorate', 70, 700, 10),
('Damietta', 'دمياط', 'governorate', 75, 750, 11),
('Port Said', 'بورسعيد', 'governorate', 75, 750, 12),
('Ismailia', 'الإسماعيلية', 'governorate', 75, 750, 13),
('Suez', 'السويس', 'governorate', 75, 750, 14)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.shipping_zones IS 'مناطق الشحن (المحافظات والمناطق الفرعية)';
COMMENT ON TABLE public.shipping_settings IS 'الإعدادات العامة للشحن';
