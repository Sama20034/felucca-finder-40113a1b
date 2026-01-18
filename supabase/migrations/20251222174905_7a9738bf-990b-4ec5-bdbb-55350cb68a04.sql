-- Add columns for selected size and color to cart_items
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS selected_size TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS selected_color_hex TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS selected_color_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS selected_color_name_ar TEXT DEFAULT '';

-- Drop the old unique constraint
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Create new unique constraint that includes size and color
ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_user_product_variant_key 
UNIQUE (user_id, product_id, selected_size, selected_color_hex);