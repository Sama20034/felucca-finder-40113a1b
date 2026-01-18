-- ==========================================
-- The Nile Store - Comprehensive SQL Setup
-- ==========================================
-- نسخ هذا السكريبت بالكامل وتنفيذه في Supabase SQL Editor

-- ==========================================
-- 1. Create Enums
-- ==========================================

CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed');
CREATE TYPE public.reward_type AS ENUM ('discount', 'free_shipping', 'product');
CREATE TYPE public.loyalty_transaction_type AS ENUM ('earn', 'redeem', 'expire');

-- ==========================================
-- 2. Create Tables
-- ==========================================

-- Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    image_url TEXT,
    description TEXT,
    description_ar TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products Table
CREATE TABLE public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    description_ar TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2) CHECK (original_price >= price),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sku TEXT UNIQUE,
    badge TEXT,
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    avatar_url TEXT,
    loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
    total_spent DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Roles Table (Critical for Security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    discount DECIMAL(10, 2) DEFAULT 0 CHECK (discount >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    coupon_code TEXT,
    loyalty_points_used INTEGER DEFAULT 0,
    loyalty_points_earned INTEGER DEFAULT 0,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_name_ar TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Coupons Table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type coupon_type NOT NULL,
    value DECIMAL(10, 2) NOT NULL CHECK (value > 0),
    min_order DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    description_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loyalty Settings Table
CREATE TABLE public.loyalty_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    points_per_pound DECIMAL(5, 2) DEFAULT 1 CHECK (points_per_pound >= 0),
    point_value DECIMAL(5, 4) DEFAULT 0.1 CHECK (point_value >= 0),
    min_redemption INTEGER DEFAULT 100 CHECK (min_redemption >= 0),
    points_expiry_days INTEGER DEFAULT 365,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loyalty Rewards Table
CREATE TABLE public.loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    points_required INTEGER NOT NULL CHECK (points_required > 0),
    reward_type reward_type NOT NULL,
    reward_value DECIMAL(10, 2) CHECK (reward_value >= 0),
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loyalty Transactions Table
CREATE TABLE public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type loyalty_transaction_type NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    description_ar TEXT,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Cart Items Table
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- ==========================================
-- 3. Create Indexes
-- ==========================================

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_loyalty_transactions_user ON public.loyalty_transactions(user_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product ON public.cart_items(product_id);

-- ==========================================
-- 4. Security Definer Functions
-- ==========================================

-- Function to check user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  -- Assign customer role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- ==========================================
-- 5. Create Triggers
-- ==========================================

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ==========================================
-- 6. Row Level Security (RLS) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Products Policies
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- User Roles Policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Orders Policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Order Items Policies
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create order items for own orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Coupons Policies
CREATE POLICY "Anyone can view active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Loyalty Settings Policies
CREATE POLICY "Anyone can view active loyalty settings"
  ON public.loyalty_settings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage loyalty settings"
  ON public.loyalty_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Loyalty Rewards Policies
CREATE POLICY "Anyone can view active rewards"
  ON public.loyalty_rewards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage rewards"
  ON public.loyalty_rewards FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Loyalty Transactions Policies
CREATE POLICY "Users can view own transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Cart Items Policies
CREATE POLICY "Users can view own cart"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 7. Seed Data - Categories
-- ==========================================

INSERT INTO public.categories (name, name_ar, slug, icon, is_active, display_order) VALUES
('Home Decor', 'ديكور منزلي', 'home-decor', '🏠', true, 1),
('Gifts', 'هدايا', 'gifts', '🎁', true, 2),
('Accessories', 'إكسسوارات', 'accessories', '💍', true, 3),
('Kitchen Tools', 'أدوات مطبخ', 'kitchen-tools', '🍴', true, 4),
('Lighting', 'إضاءة', 'lighting', '💡', true, 5),
('Textiles', 'منسوجات', 'textiles', '🧵', true, 6),
('Art & Crafts', 'فنون وحرف', 'art-crafts', '🎨', true, 7),
('Storage', 'تخزين', 'storage', '📦', true, 8);

-- ==========================================
-- 8. Seed Data - Products
-- ==========================================

INSERT INTO public.products (
  name, name_ar, slug, description, description_ar, 
  price, original_price, category_id, image_url, stock, 
  badge, rating, is_featured, is_active
) VALUES
(
  'Elegant Vase with Artificial Flowers', 
  'فازة ديكور أنيقة مع زهور صناعية',
  'elegant-vase-artificial-flowers',
  'Beautiful decorative vase with premium artificial flowers',
  'فازة ديكور جميلة مع زهور صناعية فاخرة',
  299, 450,
  (SELECT id FROM public.categories WHERE slug = 'home-decor' LIMIT 1),
  '/assets/products/product-1.jpg',
  25,
  'الأكثر مبيعاً', 4.8, true, true
),
(
  'Luxury Gift Box with Golden Ribbons',
  'صندوق هدايا فاخر مع شرائط ذهبية',
  'luxury-gift-box-golden-ribbons',
  'Premium gift box perfect for special occasions',
  'صندوق هدايا فاخر مثالي للمناسبات الخاصة',
  199, 280,
  (SELECT id FROM public.categories WHERE slug = 'gifts' LIMIT 1),
  '/assets/products/product-2.jpg',
  40,
  'جديد', 4.5, true, true
),
(
  'Scented Candle Set - 4 Pieces',
  'طقم شموع معطرة - 4 قطع',
  'scented-candle-set-4pieces',
  'Aromatic candle collection with natural scents',
  'مجموعة شموع عطرية بروائح طبيعية',
  149, 220,
  (SELECT id FROM public.categories WHERE slug = 'home-decor' LIMIT 1),
  '/assets/products/product-3.jpg',
  60,
  NULL, 4.7, true, true
),
(
  'Modern Wooden Kitchen Utensil Set',
  'طقم أدوات مطبخ خشبي عصري',
  'modern-wooden-kitchen-set',
  'Eco-friendly wooden kitchen tools set',
  'طقم أدوات مطبخ خشبي صديق للبيئة',
  350, 500,
  (SELECT id FROM public.categories WHERE slug = 'kitchen-tools' LIMIT 1),
  '/assets/products/product-4.jpg',
  30,
  'عرض خاص', 4.9, true, true
),
(
  'Gold & Silver Accessories Set',
  'طقم إكسسوارات ذهبي وفضي',
  'gold-silver-accessories-set',
  'Premium jewelry accessories collection',
  'مجموعة إكسسوارات فاخرة',
  450, 750,
  (SELECT id FROM public.categories WHERE slug = 'accessories' LIMIT 1),
  '/assets/products/product-5.jpg',
  15,
  'عرض الأسبوع', 4.9, true, true
),
(
  'Premium Decorative Tablecloth Set',
  'طقم مفارش ديكور فاخر',
  'premium-decorative-tablecloth',
  'Luxury tablecloth set for elegant dining',
  'طقم مفارش فاخر لطاولات الطعام الأنيقة',
  380, 600,
  (SELECT id FROM public.categories WHERE slug = 'textiles' LIMIT 1),
  '/assets/products/product-6.jpg',
  20,
  NULL, 4.6, false, true
),
(
  'Classic Decorative Vase',
  'فازة ديكور كلاسيكية',
  'classic-decorative-vase',
  'Timeless design vase for any room',
  'فازة بتصميم كلاسيكي لأي غرفة',
  199, 350,
  (SELECT id FROM public.categories WHERE slug = 'home-decor' LIMIT 1),
  '/assets/products/product-1.jpg',
  35,
  NULL, 4.7, false, true
),
(
  'Small Gift Box',
  'صندوق هدايا صغير',
  'small-gift-box',
  'Compact gift box for small presents',
  'صندوق هدايا صغير للهدايا المتواضعة',
  99, 150,
  (SELECT id FROM public.categories WHERE slug = 'gifts' LIMIT 1),
  '/assets/products/product-2.jpg',
  50,
  NULL, 4.5, false, true
),
(
  'Modern LED Table Lamp',
  'مصباح طاولة LED عصري',
  'modern-led-table-lamp',
  'Energy-efficient LED lamp with adjustable brightness',
  'مصباح LED موفر للطاقة بإضاءة قابلة للتعديل',
  275, 400,
  (SELECT id FROM public.categories WHERE slug = 'lighting' LIMIT 1),
  '/assets/products/product-3.jpg',
  45,
  NULL, 4.6, false, true
),
(
  'Handmade Ceramic Bowl',
  'وعاء سيراميك مصنوع يدوياً',
  'handmade-ceramic-bowl',
  'Artisan crafted ceramic bowl',
  'وعاء سيراميك من صنع الحرفيين',
  180, 250,
  (SELECT id FROM public.categories WHERE slug = 'art-crafts' LIMIT 1),
  '/assets/products/product-4.jpg',
  28,
  NULL, 4.8, false, true
),
(
  'Storage Basket Set - 3 Pieces',
  'طقم سلال تخزين - 3 قطع',
  'storage-basket-set-3pieces',
  'Woven storage baskets for organization',
  'سلال تخزين منسوجة للتنظيم',
  220, 320,
  (SELECT id FROM public.categories WHERE slug = 'storage' LIMIT 1),
  '/assets/products/product-5.jpg',
  32,
  NULL, 4.4, false, true
),
(
  'Decorative Wall Mirror',
  'مرآة حائط ديكورية',
  'decorative-wall-mirror',
  'Elegant wall mirror with ornate frame',
  'مرآة حائط أنيقة بإطار مزخرف',
  420, 650,
  (SELECT id FROM public.categories WHERE slug = 'home-decor' LIMIT 1),
  '/assets/products/product-6.jpg',
  18,
  NULL, 4.7, false, true
);

-- ==========================================
-- 9. Seed Data - Loyalty Settings
-- ==========================================

INSERT INTO public.loyalty_settings (
  points_per_pound, 
  point_value, 
  min_redemption, 
  points_expiry_days, 
  is_active
) VALUES (1, 0.1, 100, 365, true);

-- ==========================================
-- 10. Seed Data - Sample Coupons
-- ==========================================

INSERT INTO public.coupons (
  code, type, value, min_order, max_uses, 
  description, description_ar, is_active
) VALUES
('WELCOME10', 'percentage', 10, 100, 100, 
 'Welcome discount 10%', 'خصم ترحيبي 10%', true),
('SAVE50', 'fixed', 50, 200, 50,
 'Save 50 EGP on orders over 200', 'وفر 50 جنيه على الطلبات فوق 200', true);

-- ==========================================
-- تم إنشاء قاعدة البيانات بنجاح!
-- ==========================================

-- الخطوة التالية:
-- 1. انسخ هذا السكريبت بالكامل
-- 2. افتح Supabase Studio → SQL Editor
-- 3. الصق السكريبت واضغط Run
-- 4. اذهب إلى Authentication → Users وأنشئ أول مستخدم
-- 5. نفذ الأمر التالي لجعله Admin:

-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'admin');

-- استبدل USER_ID_HERE بالـ UUID الخاص بالمستخدم
