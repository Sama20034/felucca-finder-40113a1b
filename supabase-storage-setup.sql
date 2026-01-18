-- إنشاء Storage Buckets للمنتجات والفئات

-- إنشاء bucket للمنتجات
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- إنشاء bucket للفئات
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies لـ bucket المنتجات
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- RLS Policies لـ bucket الفئات
CREATE POLICY "Anyone can view category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');

CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'categories' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'categories' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'categories' AND auth.role() = 'authenticated');
