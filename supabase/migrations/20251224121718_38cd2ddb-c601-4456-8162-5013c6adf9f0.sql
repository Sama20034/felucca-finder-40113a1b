-- Add length filter to filter_settings
INSERT INTO public.filter_settings (filter_key, name, name_ar, display_order, is_active)
VALUES ('length', 'Length', 'الطول', 6, true)
ON CONFLICT (filter_key) DO NOTHING;

-- Update display_order for brand and material to be after length
UPDATE public.filter_settings SET display_order = 7 WHERE filter_key = 'brand';
UPDATE public.filter_settings SET display_order = 8 WHERE filter_key = 'material';