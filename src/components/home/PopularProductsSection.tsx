import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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
}

const PopularProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, name_ar, price, original_price, image_url, images, badge, loyalty_points, sizes, colors')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
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

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header - SHEIN Style */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t('bestseller')}
          </h2>
          <button
            onClick={() => navigate('/shop?bestseller=true')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {t('viewAll')}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Products Grid - SHEIN Style */}
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

export default PopularProductsSection;