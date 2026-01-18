-- Add length column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS length text,
ADD COLUMN IF NOT EXISTS length_ar text;

-- Create index for length filter
CREATE INDEX IF NOT EXISTS idx_products_length ON public.products(length);