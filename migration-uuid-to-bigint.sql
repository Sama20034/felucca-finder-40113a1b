-- ==========================================
-- Migration: Convert products.id from UUID to BIGINT
-- ==========================================
-- Description: This migration converts the products table ID column
-- from UUID to BIGINT and updates all foreign key references
-- 
-- IMPORTANT: انسخ هذا الـ Migration بالكامل ونفذه في Supabase SQL Editor
-- ==========================================

-- Step 1: Disable RLS temporarily for migration
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing foreign key constraints
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE public.loyalty_rewards DROP CONSTRAINT IF EXISTS loyalty_rewards_product_id_fkey;

-- Step 3: Drop existing indexes on foreign keys
DROP INDEX IF EXISTS idx_cart_items_product;

-- Step 4: Add temporary BIGINT columns
ALTER TABLE public.products ADD COLUMN new_id BIGSERIAL;
ALTER TABLE public.order_items ADD COLUMN new_product_id BIGINT;
ALTER TABLE public.cart_items ADD COLUMN new_product_id BIGINT;
ALTER TABLE public.loyalty_rewards ADD COLUMN new_product_id BIGINT;

-- Step 5: Create mapping table for UUID to BIGINT conversion
CREATE TEMP TABLE id_mapping AS
SELECT id AS old_id, new_id FROM public.products;

-- Step 6: Update all foreign key references
UPDATE public.order_items 
SET new_product_id = id_mapping.new_id 
FROM id_mapping 
WHERE order_items.product_id = id_mapping.old_id;

UPDATE public.cart_items 
SET new_product_id = id_mapping.new_id 
FROM id_mapping 
WHERE cart_items.product_id = id_mapping.old_id;

UPDATE public.loyalty_rewards 
SET new_product_id = id_mapping.new_id 
FROM id_mapping 
WHERE loyalty_rewards.product_id = id_mapping.old_id;

-- Step 7: Drop old ID columns
ALTER TABLE public.products DROP CONSTRAINT products_pkey;
ALTER TABLE public.products DROP COLUMN id;
ALTER TABLE public.order_items DROP COLUMN product_id;
ALTER TABLE public.cart_items DROP COLUMN product_id;
ALTER TABLE public.loyalty_rewards DROP COLUMN product_id;

-- Step 8: Rename new columns to original names
ALTER TABLE public.products RENAME COLUMN new_id TO id;
ALTER TABLE public.order_items RENAME COLUMN new_product_id TO product_id;
ALTER TABLE public.cart_items RENAME COLUMN new_product_id TO product_id;
ALTER TABLE public.loyalty_rewards RENAME COLUMN new_product_id TO product_id;

-- Step 9: Add primary key and indexes
ALTER TABLE public.products ADD PRIMARY KEY (id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_cart_items_product ON public.cart_items(product_id);

-- Step 10: Recreate foreign key constraints
ALTER TABLE public.order_items 
  ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

ALTER TABLE public.cart_items 
  ADD CONSTRAINT cart_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.loyalty_rewards 
  ADD CONSTRAINT loyalty_rewards_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- Step 11: Re-enable RLS with updated policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Verification (Optional - للتحقق من نجاح الـ Migration)
-- ==========================================
SELECT 'products' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'cart_items', COUNT(*) FROM public.cart_items
UNION ALL
SELECT 'order_items', COUNT(*) FROM public.order_items;

-- ==========================================
-- Migration Complete ✅
-- ==========================================
-- ملاحظات مهمة بعد تنفيذ الـ Migration:
-- 1. جميع بيانات المنتجات الموجودة محفوظة مع IDs جديدة من نوع BIGINT
-- 2. جميع العلاقات (Foreign Keys) تم تحديثها بشكل صحيح
-- 3. يمكنك الآن استخدام IDs رقمية بسيطة (1, 2, 3) بدلاً من UUIDs
-- 4. المنتجات ستُضاف للسلة بشكل صحيح مع كامل البيانات
-- ==========================================
