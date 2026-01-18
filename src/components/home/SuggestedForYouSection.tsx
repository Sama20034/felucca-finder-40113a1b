import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface ColorOption {
  name: string;
  name_ar: string;
  hex: string;
}

interface Product {
  id: number;
  name: string;
  name_ar: string;
  price: number;
  original_price: number | null;
  image_url: string;
  images: string[] | null;
  badge: string | null;
  loyalty_points: number | null;
  sizes: string[] | null;
  colors: ColorOption[] | null;
  category_id: number | null;
}

const SuggestedForYouSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPersonalizedProducts();
    } else {
      fetchPopularProducts();
    }
  }, [user]);

  // Fetch personalized products based on user behavior
  const fetchPersonalizedProducts = async () => {
    try {
      setLoading(true);
      
      // 1. Get category IDs from user's orders
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          product_id,
          order:orders!inner(user_id)
        `)
        .eq('order.user_id', user!.id)
        .limit(20);

      // 2. Get category IDs from user's wishlist
      const { data: wishlistItems } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user!.id)
        .limit(10);

      // Collect all product IDs from orders and wishlist
      const productIds = new Set<number>();
      orderItems?.forEach(item => {
        if (item.product_id) productIds.add(item.product_id);
      });
      wishlistItems?.forEach(item => {
        if (item.product_id) productIds.add(item.product_id);
      });

      let categoryIds: number[] = [];
      
      // Get categories of these products
      if (productIds.size > 0) {
        const { data: productsWithCategories } = await supabase
          .from('products')
          .select('category_id')
          .in('id', Array.from(productIds))
          .not('category_id', 'is', null);

        categoryIds = [...new Set(productsWithCategories?.map(p => p.category_id).filter(Boolean) as number[])];
      }

      // Fetch suggested products from same categories (excluding already purchased/wishlisted)
      let suggestedProducts: Product[] = [];
      
      if (categoryIds.length > 0) {
        const { data } = await supabase
          .from('products')
          .select('id, name, name_ar, price, original_price, image_url, images, badge, loyalty_points, sizes, colors, category_id')
          .in('category_id', categoryIds)
          .not('id', 'in', `(${Array.from(productIds).join(',') || 0})`)
          .eq('is_active', true)
          .order('sales_count', { ascending: false })
          .limit(8);

        suggestedProducts = data || [];
      }

      // If not enough products, fill with popular products
      if (suggestedProducts.length < 8) {
        const excludeIds = [...Array.from(productIds), ...suggestedProducts.map(p => p.id)];
        const { data: fillProducts } = await supabase
          .from('products')
          .select('id, name, name_ar, price, original_price, image_url, images, badge, loyalty_points, sizes, colors, category_id')
          .not('id', 'in', `(${excludeIds.join(',') || 0})`)
          .eq('is_active', true)
          .order('sales_count', { ascending: false })
          .limit(8 - suggestedProducts.length);

        suggestedProducts = [...suggestedProducts, ...(fillProducts || [])];
      }

      setProducts(suggestedProducts);
    } catch (error) {
      console.error('Error fetching personalized products:', error);
      // Fallback to popular products
      fetchPopularProducts();
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular products for non-logged-in users
  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, name_ar, price, original_price, image_url, images, badge, loyalty_points, sizes, colors, category_id')
        .eq('is_active', true)
        .order('sales_count', { ascending: false })
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {isRTL ? 'مقترح لك' : 'Suggested for You'}
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {t('viewAll')}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Personalization Hint */}
        {user && (
          <p className="text-xs text-muted-foreground mb-4">
            {isRTL 
              ? 'بناءً على مشترياتك وقائمة أمنياتك' 
              : 'Based on your purchases and wishlist'}
          </p>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id.toString()}
              name={product.name}
              nameAr={product.name_ar}
              price={product.price}
              originalPrice={product.original_price || undefined}
              image={product.image_url}
              images={product.images}
              badge={product.badge || undefined}
              loyaltyPoints={product.loyalty_points || undefined}
              sizes={product.sizes}
              colors={product.colors}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedForYouSection;
