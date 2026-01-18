import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, Flame, Clock } from "lucide-react";
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

const BestDealsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchDealsProducts();
  }, []);

  const fetchDealsProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, name_ar, price, original_price, image_url, images, badge, loyalty_points, sizes, colors')
        .eq('show_in_deals', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching deals products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
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
    <section className="py-8 bg-gradient-to-b from-accent/50 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header - SHEIN Flash Sale Style */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              <Flame className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-lg">{t('bestDeals')}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>{isRTL ? 'ينتهي خلال:' : 'Ends in:'}</span>
              <div className="flex gap-1">
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono text-xs">23</span>
                <span>:</span>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono text-xs">59</span>
                <span>:</span>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono text-xs">59</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/shop?sale=true')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {t('viewAll')}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

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

export default BestDealsSection;