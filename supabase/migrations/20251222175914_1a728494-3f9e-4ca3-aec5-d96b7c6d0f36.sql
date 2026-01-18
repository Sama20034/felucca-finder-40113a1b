-- Create filter_options table to store sizes, colors that admin can manage
CREATE TABLE public.filter_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'size' or 'color'
  value text NOT NULL, -- for size: 'S', 'M', etc. For color: hex code
  name text NOT NULL, -- display name in English
  name_ar text NOT NULL, -- display name in Arabic
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create unique constraint for type + value
ALTER TABLE public.filter_options ADD CONSTRAINT filter_options_type_value_unique UNIQUE (type, value);

-- Enable RLS
ALTER TABLE public.filter_options ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active filter options"
ON public.filter_options
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage filter options"
ON public.filter_options
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_filter_options_updated_at
BEFORE UPDATE ON public.filter_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sizes
INSERT INTO public.filter_options (type, value, name, name_ar, display_order) VALUES
('size', 'XS', 'XS', 'XS', 1),
('size', 'S', 'S', 'S', 2),
('size', 'M', 'M', 'M', 3),
('size', 'L', 'L', 'L', 4),
('size', 'XL', 'XL', 'XL', 5),
('size', 'XXL', 'XXL', 'XXL', 6),
('size', 'XXXL', 'XXXL', 'XXXL', 7),
('size', '36', '36', '36', 8),
('size', '38', '38', '38', 9),
('size', '40', '40', '40', 10),
('size', '42', '42', '42', 11),
('size', '44', '44', '44', 12),
('size', '46', '46', '46', 13),
('size', '48', '48', '48', 14);

-- Insert default colors
INSERT INTO public.filter_options (type, value, name, name_ar, display_order) VALUES
('color', '#000000', 'Black', 'أسود', 1),
('color', '#FFFFFF', 'White', 'أبيض', 2),
('color', '#EF4444', 'Red', 'أحمر', 3),
('color', '#3B82F6', 'Blue', 'أزرق', 4),
('color', '#22C55E', 'Green', 'أخضر', 5),
('color', '#EC4899', 'Pink', 'وردي', 6),
('color', '#A855F7', 'Purple', 'بنفسجي', 7),
('color', '#F97316', 'Orange', 'برتقالي', 8),
('color', '#6B7280', 'Gray', 'رمادي', 9),
('color', '#92400E', 'Brown', 'بني', 10),
('color', '#1E3A5F', 'Navy', 'كحلي', 11),
('color', '#D4C4B0', 'Beige', 'بيج', 12);