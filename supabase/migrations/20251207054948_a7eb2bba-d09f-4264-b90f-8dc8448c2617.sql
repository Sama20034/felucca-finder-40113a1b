-- ==========================================
-- المرحلة 1: إنشاء الـ Enums
-- ==========================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed');
CREATE TYPE public.reward_type AS ENUM ('discount', 'free_shipping', 'gift');
CREATE TYPE public.loyalty_transaction_type AS ENUM ('earn', 'redeem', 'expire', 'adjust');

-- ==========================================
-- المرحلة 2: إنشاء الجداول الأساسية أولاً
-- ==========================================

-- جدول الفئات
CREATE TABLE public.categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول المنتجات
CREATE TABLE public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image_url TEXT,
    images TEXT[],
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الملفات الشخصية
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    governorate TEXT,
    avatar_url TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول أدوار المستخدمين
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- ==========================================
-- المرحلة 3: إنشاء الـ Functions بعد الجداول
-- ==========================================

-- دالة التحقق من الصلاحيات (Security Definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- المرحلة 4: إنشاء باقي الجداول
-- ==========================================

-- جدول الطلبات (بدون generate_order_number مؤقتاً)
CREATE TABLE public.orders (
    id BIGSERIAL PRIMARY KEY,
    order_number TEXT UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT,
    shipping_governorate TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    coupon_code TEXT,
    status order_status DEFAULT 'pending',
    notes TEXT,
    loyalty_points_earned INTEGER DEFAULT 0,
    loyalty_points_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- دالة توليد رقم الطلب
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_number text;
  today_date text;
  sequence_num integer;
BEGIN
  today_date := to_char(current_date, 'YYYYMMDD');
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS integer)), 0) + 1
  INTO sequence_num
  FROM public.orders
  WHERE order_number LIKE 'ORD' || today_date || '%';
  new_number := 'ORD' || today_date || LPAD(sequence_num::text, 4, '0');
  RETURN new_number;
END;
$$;

-- تعيين القيمة الافتراضية لـ order_number
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT public.generate_order_number();

-- جدول عناصر الطلب
CREATE TABLE public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_name_ar TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الكوبونات
CREATE TABLE public.coupons (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    description_ar TEXT,
    type coupon_type NOT NULL DEFAULT 'percentage',
    value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول سلة التسوق
CREATE TABLE public.cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, product_id)
);

-- جدول المفضلة
CREATE TABLE public.wishlist (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, product_id)
);

-- جدول مناطق الشحن
CREATE TABLE public.shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('governorate', 'area')),
    parent_id UUID REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    free_shipping_threshold DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول إعدادات الشحن
CREATE TABLE public.shipping_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 50,
    free_shipping_threshold DECIMAL(10, 2),
    is_zone_based BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول إعدادات الولاء
CREATE TABLE public.loyalty_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    points_per_pound DECIMAL(10, 2) DEFAULT 1,
    points_value DECIMAL(10, 4) DEFAULT 0.1,
    min_redemption_points INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول مكافآت الولاء
CREATE TABLE public.loyalty_rewards (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    type reward_type NOT NULL,
    points_required INTEGER NOT NULL,
    value DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول معاملات الولاء
CREATE TABLE public.loyalty_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type loyalty_transaction_type NOT NULL,
    points INTEGER NOT NULL,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- المرحلة 5: إنشاء الفهارس
-- ==========================================

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX idx_shipping_zones_parent ON public.shipping_zones(parent_id);
CREATE INDEX idx_shipping_zones_type ON public.shipping_zones(type);
CREATE INDEX idx_loyalty_transactions_user ON public.loyalty_transactions(user_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- ==========================================
-- المرحلة 6: إنشاء Triggers
-- ==========================================

-- دالة إنشاء profile للمستخدم الجديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger لإنشاء profile عند تسجيل مستخدم جديد
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers لتحديث updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON public.shipping_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shipping_settings_updated_at BEFORE UPDATE ON public.shipping_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_settings_updated_at BEFORE UPDATE ON public.loyalty_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_rewards_updated_at BEFORE UPDATE ON public.loyalty_rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- المرحلة 7: تفعيل RLS وإنشاء السياسات
-- ==========================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- سياسات الفئات
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات المنتجات
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات الملفات الشخصية
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات أدوار المستخدمين
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات الطلبات
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات عناصر الطلب
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)));
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات الكوبونات
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات سلة التسوق
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- سياسات المفضلة
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- سياسات مناطق الشحن
CREATE POLICY "Anyone can view active shipping zones" ON public.shipping_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage shipping zones" ON public.shipping_zones FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات إعدادات الشحن
CREATE POLICY "Anyone can view shipping settings" ON public.shipping_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage shipping settings" ON public.shipping_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات إعدادات الولاء
CREATE POLICY "Anyone can view loyalty settings" ON public.loyalty_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage loyalty settings" ON public.loyalty_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات مكافآت الولاء
CREATE POLICY "Anyone can view active rewards" ON public.loyalty_rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage rewards" ON public.loyalty_rewards FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- سياسات معاملات الولاء
CREATE POLICY "Users can view own transactions" ON public.loyalty_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all transactions" ON public.loyalty_transactions FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- المرحلة 8: إنشاء Storage Buckets
-- ==========================================

INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true) ON CONFLICT (id) DO NOTHING;

-- سياسات Storage
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view category images" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Authenticated users can upload category images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update category images" ON storage.objects FOR UPDATE USING (bucket_id = 'categories' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete category images" ON storage.objects FOR DELETE USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- ==========================================
-- المرحلة 9: إضافة البيانات الأساسية
-- ==========================================

-- إضافة الفئات
INSERT INTO public.categories (name, name_ar, description, description_ar, image_url, display_order) VALUES
('Electronics', 'إلكترونيات', 'Electronic devices and accessories', 'الأجهزة والإكسسوارات الإلكترونية', '/assets/products/product-1.jpg', 1),
('Clothing', 'ملابس', 'Men and women clothing', 'ملابس رجالي وحريمي', '/assets/products/product-2.jpg', 2),
('Home & Kitchen', 'المنزل والمطبخ', 'Home appliances and kitchenware', 'أجهزة منزلية وأدوات مطبخ', '/assets/products/product-3.jpg', 3),
('Beauty & Health', 'الجمال والصحة', 'Beauty products and health care', 'منتجات التجميل والعناية الصحية', '/assets/products/product-4.jpg', 4),
('Sports & Outdoors', 'الرياضة', 'Sports equipment and outdoor gear', 'معدات رياضية وأدوات خارجية', '/assets/products/product-5.jpg', 5),
('Books', 'كتب', 'Books and educational materials', 'كتب ومواد تعليمية', '/assets/products/product-6.jpg', 6),
('Toys & Games', 'ألعاب', 'Toys and games for all ages', 'ألعاب لجميع الأعمار', '/assets/products/product-1.jpg', 7),
('Accessories', 'إكسسوارات', 'Fashion accessories', 'إكسسوارات الموضة', '/assets/products/product-2.jpg', 8);

-- إضافة المنتجات
INSERT INTO public.products (name, name_ar, description, description_ar, price, original_price, image_url, category_id, stock_quantity, is_featured, loyalty_points) VALUES
('Wireless Headphones', 'سماعات لاسلكية', 'High quality wireless headphones', 'سماعات لاسلكية عالية الجودة', 299.99, 399.99, '/assets/products/product-1.jpg', 1, 50, true, 30),
('Smart Watch', 'ساعة ذكية', 'Feature-rich smartwatch', 'ساعة ذكية متعددة المميزات', 599.99, 799.99, '/assets/products/product-2.jpg', 1, 30, true, 60),
('Cotton T-Shirt', 'تيشيرت قطن', 'Comfortable cotton t-shirt', 'تيشيرت قطن مريح', 149.99, NULL, '/assets/products/product-3.jpg', 2, 100, false, 15),
('Jeans', 'جينز', 'Classic denim jeans', 'جينز دنيم كلاسيك', 299.99, 349.99, '/assets/products/product-4.jpg', 2, 80, false, 30),
('Blender', 'خلاط', 'Powerful kitchen blender', 'خلاط مطبخ قوي', 449.99, 549.99, '/assets/products/product-5.jpg', 3, 40, true, 45),
('Coffee Maker', 'ماكينة قهوة', 'Automatic coffee maker', 'ماكينة قهوة أوتوماتيكية', 899.99, 999.99, '/assets/products/product-6.jpg', 3, 25, true, 90),
('Face Cream', 'كريم وجه', 'Moisturizing face cream', 'كريم مرطب للوجه', 199.99, 249.99, '/assets/products/product-1.jpg', 4, 60, false, 20),
('Vitamin Set', 'مجموعة فيتامينات', 'Complete vitamin supplement set', 'مجموعة مكملات فيتامينات كاملة', 349.99, NULL, '/assets/products/product-2.jpg', 4, 45, false, 35),
('Yoga Mat', 'سجادة يوجا', 'Premium yoga mat', 'سجادة يوجا ممتازة', 179.99, 229.99, '/assets/products/product-3.jpg', 5, 70, false, 18),
('Dumbbell Set', 'مجموعة دمبل', 'Adjustable dumbbell set', 'مجموعة دمبل قابلة للتعديل', 599.99, 699.99, '/assets/products/product-4.jpg', 5, 35, true, 60),
('Novel Collection', 'مجموعة روايات', 'Bestselling novels collection', 'مجموعة روايات الأكثر مبيعاً', 249.99, 299.99, '/assets/products/product-5.jpg', 6, 90, false, 25),
('Educational Kit', 'مجموعة تعليمية', 'Kids educational kit', 'مجموعة تعليمية للأطفال', 399.99, 449.99, '/assets/products/product-6.jpg', 7, 55, true, 40);

-- إضافة إعدادات الشحن الافتراضية
INSERT INTO public.shipping_settings (default_shipping_cost, free_shipping_threshold, is_zone_based)
VALUES (50, 500, false);

-- إضافة إعدادات الولاء الافتراضية
INSERT INTO public.loyalty_settings (points_per_pound, points_value, min_redemption_points, is_active)
VALUES (1, 0.1, 100, true);

-- إضافة مناطق الشحن (المحافظات المصرية)
INSERT INTO public.shipping_zones (name, name_ar, type, shipping_cost, free_shipping_threshold, display_order) VALUES
('Cairo', 'القاهرة', 'governorate', 50, 500, 1),
('Giza', 'الجيزة', 'governorate', 50, 500, 2),
('Alexandria', 'الإسكندرية', 'governorate', 60, 600, 3),
('Qalyubia', 'القليوبية', 'governorate', 60, 600, 4),
('Sharqia', 'الشرقية', 'governorate', 70, 700, 5),
('Dakahlia', 'الدقهلية', 'governorate', 70, 700, 6),
('Beheira', 'البحيرة', 'governorate', 70, 700, 7),
('Gharbia', 'الغربية', 'governorate', 70, 700, 8),
('Monufia', 'المنوفية', 'governorate', 70, 700, 9),
('Kafr El Sheikh', 'كفر الشيخ', 'governorate', 70, 700, 10),
('Damietta', 'دمياط', 'governorate', 75, 750, 11),
('Port Said', 'بورسعيد', 'governorate', 75, 750, 12),
('Ismailia', 'الإسماعيلية', 'governorate', 75, 750, 13),
('Suez', 'السويس', 'governorate', 75, 750, 14);

-- إضافة مكافآت الولاء
INSERT INTO public.loyalty_rewards (name, name_ar, description, description_ar, type, points_required, value) VALUES
('5% Discount', 'خصم 5%', '5% discount on your order', 'خصم 5% على طلبك', 'discount', 500, 5),
('10% Discount', 'خصم 10%', '10% discount on your order', 'خصم 10% على طلبك', 'discount', 1000, 10),
('Free Shipping', 'شحن مجاني', 'Free shipping on your order', 'شحن مجاني على طلبك', 'free_shipping', 300, NULL),
('15% Discount', 'خصم 15%', '15% discount on your order', 'خصم 15% على طلبك', 'discount', 1500, 15);