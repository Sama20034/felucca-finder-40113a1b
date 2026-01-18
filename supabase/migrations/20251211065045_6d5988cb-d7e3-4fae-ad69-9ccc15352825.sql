-- Add related_products column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS related_products BIGINT[] DEFAULT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.products.related_products IS 'Array of product IDs that are related to this product';