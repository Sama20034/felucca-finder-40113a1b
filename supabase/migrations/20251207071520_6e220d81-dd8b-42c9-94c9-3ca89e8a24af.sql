-- Add new product fields for filtering and search
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand_ar TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material_ar TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors JSONB;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_material ON public.products(material);
CREATE INDEX IF NOT EXISTS idx_products_sales_count ON public.products(sales_count DESC);