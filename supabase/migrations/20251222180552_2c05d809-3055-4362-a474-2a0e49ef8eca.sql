-- Create filter_settings table to control which filters are visible and their order
CREATE TABLE public.filter_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_key text NOT NULL UNIQUE, -- 'search', 'category', 'size', 'color', 'price', 'brand', 'material'
  name text NOT NULL,
  name_ar text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.filter_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view filter settings"
ON public.filter_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage filter settings"
ON public.filter_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_filter_settings_updated_at
BEFORE UPDATE ON public.filter_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default filter settings
INSERT INTO public.filter_settings (filter_key, name, name_ar, display_order, is_active) VALUES
('search', 'Search', 'البحث', 1, true),
('category', 'Categories', 'الفئات', 2, true),
('size', 'Sizes', 'المقاسات', 3, true),
('color', 'Colors', 'الألوان', 4, true),
('price', 'Price Range', 'نطاق السعر', 5, true),
('brand', 'Brand', 'الماركة', 6, true),
('material', 'Material', 'الخامة', 7, true);