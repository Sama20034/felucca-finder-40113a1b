-- Add show_in_deals column to products table
ALTER TABLE public.products 
ADD COLUMN show_in_deals boolean DEFAULT false;

-- Update existing products with original_price to show in deals by default
UPDATE public.products 
SET show_in_deals = true 
WHERE original_price IS NOT NULL;