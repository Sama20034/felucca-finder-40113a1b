-- حذف الأقسام القديمة وإضافة أقسام الملابس الجديدة
DELETE FROM public.categories;

-- إضافة أقسام الملابس
INSERT INTO public.categories (name, name_ar, description, description_ar, image_url, is_active, display_order) VALUES
('Women Clothing', 'ملابس نسائية', 'Women fashion and clothing', 'موضة وملابس نسائية عصرية', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', true, 1),
('Dresses', 'فساتين', 'Elegant dresses for all occasions', 'فساتين أنيقة لجميع المناسبات', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', true, 2),
('Tops', 'بلوزات وتيشيرتات', 'Trendy tops and t-shirts', 'بلوزات وتيشيرتات عصرية', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', true, 3),
('Pants', 'بناطيل', 'Stylish pants and trousers', 'بناطيل وسراويل أنيقة', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', true, 4),
('Swimwear', 'ملابس سباحة', 'Swimsuits and beachwear', 'ملابس سباحة وبحر', 'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400', true, 5),
('Accessories', 'إكسسوارات', 'Fashion accessories', 'إكسسوارات موضة', 'https://images.unsplash.com/photo-1611923134239-b9be5b4d1b27?w=400', true, 6),
('Bags', 'حقائب', 'Handbags and purses', 'شنط وحقائب يد', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', true, 7),
('Shoes', 'أحذية', 'Shoes and footwear', 'أحذية نسائية', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', true, 8),
('Sleepwear', 'ملابس نوم', 'Sleepwear and loungewear', 'ملابس نوم ولاونج وير', 'https://images.unsplash.com/photo-1616627451515-cbc80e5ece35?w=400', true, 9),
('Lingerie', 'ملابس داخلية', 'Lingerie and underwear', 'ملابس داخلية', 'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=400', true, 10),
('Sports', 'ملابس رياضية', 'Activewear and sportswear', 'ملابس رياضية وأكتيف وير', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400', true, 11),
('Jewelry', 'مجوهرات', 'Fashion jewelry', 'مجوهرات وحلي', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', true, 12);

-- حذف المنتجات القديمة وإضافة منتجات ملابس جديدة
DELETE FROM public.products;

-- إضافة منتجات الملابس
INSERT INTO public.products (name, name_ar, description, description_ar, price, original_price, image_url, category_id, stock_quantity, is_active, is_featured, badge, loyalty_points) VALUES
-- فساتين
('Floral Summer Dress', 'فستان صيفي مورد', 'Beautiful floral print summer dress', 'فستان صيفي جميل بطبعة ورود', 299, 450, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', (SELECT id FROM categories WHERE name='Dresses'), 50, true, true, 'الأكثر مبيعاً', 30),
('Elegant Evening Dress', 'فستان سهرة أنيق', 'Elegant evening gown', 'فستان سهرة راقي', 599, 899, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', (SELECT id FROM categories WHERE name='Dresses'), 30, true, true, 'جديد', 60),
('Casual Maxi Dress', 'فستان ماكسي كاجوال', 'Comfortable maxi dress', 'فستان ماكسي مريح للخروجات اليومية', 249, 350, 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=400', (SELECT id FROM categories WHERE name='Dresses'), 45, true, false, NULL, 25),

-- بلوزات
('Basic White Blouse', 'بلوزة بيضاء أساسية', 'Classic white blouse', 'بلوزة بيضاء كلاسيكية', 149, 220, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400', (SELECT id FROM categories WHERE name='Tops'), 100, true, true, 'عرض خاص', 15),
('Crop Top', 'كروب توب', 'Trendy crop top', 'كروب توب عصري', 99, 150, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400', (SELECT id FROM categories WHERE name='Tops'), 80, true, false, NULL, 10),
('Printed T-Shirt', 'تيشيرت مطبوع', 'Casual printed t-shirt', 'تيشيرت كاجوال بطبعات', 89, 130, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', (SELECT id FROM categories WHERE name='Tops'), 120, true, true, 'الأكثر مبيعاً', 9),

-- بناطيل
('High Waist Jeans', 'جينز عالي الخصر', 'High waist skinny jeans', 'جينز سكيني عالي الخصر', 279, 400, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', (SELECT id FROM categories WHERE name='Pants'), 60, true, true, 'جديد', 28),
('Wide Leg Pants', 'بنطلون واسع', 'Comfortable wide leg pants', 'بنطلون واسع مريح', 199, 280, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', (SELECT id FROM categories WHERE name='Pants'), 40, true, false, NULL, 20),
('Leggings', 'ليجنز', 'Stretchy leggings', 'ليجنز مطاط مريح', 79, 120, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400', (SELECT id FROM categories WHERE name='Pants'), 150, true, false, 'عرض خاص', 8),

-- ملابس سباحة
('Bikini Set', 'بيكيني', 'Two-piece bikini set', 'طقم بيكيني قطعتين', 199, 320, 'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400', (SELECT id FROM categories WHERE name='Swimwear'), 35, true, true, 'جديد', 20),
('One Piece Swimsuit', 'مايوه قطعة واحدة', 'Elegant one piece swimsuit', 'مايوه قطعة واحدة أنيق', 249, 380, 'https://images.unsplash.com/photo-1568722406901-3c3c9d8f6d9b?w=400', (SELECT id FROM categories WHERE name='Swimwear'), 25, true, false, NULL, 25),

-- إكسسوارات
('Gold Necklace', 'قلادة ذهبية', 'Elegant gold chain necklace', 'قلادة سلسلة ذهبية أنيقة', 149, 220, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', (SELECT id FROM categories WHERE name='Accessories'), 80, true, true, 'الأكثر مبيعاً', 15),
('Fashion Sunglasses', 'نظارة شمسية', 'Trendy sunglasses', 'نظارة شمسية عصرية', 99, 180, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', (SELECT id FROM categories WHERE name='Accessories'), 100, true, false, NULL, 10),
('Silk Scarf', 'إيشارب حرير', 'Luxury silk scarf', 'إيشارب حرير فاخر', 129, 200, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', (SELECT id FROM categories WHERE name='Accessories'), 60, true, false, 'جديد', 13),

-- حقائب
('Crossbody Bag', 'شنطة كروس', 'Stylish crossbody bag', 'شنطة كروس عصرية', 179, 280, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', (SELECT id FROM categories WHERE name='Bags'), 45, true, true, 'عرض خاص', 18),
('Tote Bag', 'شنطة توت', 'Large tote bag', 'شنطة توت كبيرة', 199, 300, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', (SELECT id FROM categories WHERE name='Bags'), 55, true, false, NULL, 20),

-- أحذية
('High Heels', 'كعب عالي', 'Elegant high heels', 'كعب عالي أنيق', 299, 450, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', (SELECT id FROM categories WHERE name='Shoes'), 40, true, true, 'الأكثر مبيعاً', 30),
('Sneakers', 'سنيكرز', 'Comfortable sneakers', 'سنيكرز مريح', 249, 380, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400', (SELECT id FROM categories WHERE name='Shoes'), 70, true, true, 'جديد', 25),
('Flat Sandals', 'صندل فلات', 'Casual flat sandals', 'صندل فلات كاجوال', 129, 180, 'https://images.unsplash.com/photo-1562273138-f46be7bf5563?w=400', (SELECT id FROM categories WHERE name='Shoes'), 90, true, false, NULL, 13),

-- ملابس نوم
('Satin Pajama Set', 'بيجامة ساتان', 'Luxurious satin pajama set', 'طقم بيجامة ساتان فاخر', 199, 320, 'https://images.unsplash.com/photo-1616627451515-cbc80e5ece35?w=400', (SELECT id FROM categories WHERE name='Sleepwear'), 50, true, true, 'جديد', 20),
('Cotton Nightgown', 'قميص نوم قطن', 'Comfortable cotton nightgown', 'قميص نوم قطن مريح', 149, 220, 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400', (SELECT id FROM categories WHERE name='Sleepwear'), 65, true, false, NULL, 15);