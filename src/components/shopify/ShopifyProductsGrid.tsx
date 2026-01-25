import { useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "./ShopifyProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShopifyProductsGridProps {
  limit?: number;
  query?: string;
}

export const ShopifyProductsGrid = ({ limit = 50, query }: ShopifyProductsGridProps) => {
  const { isRTL } = useLanguage();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchShopifyProducts(limit, query);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(isRTL ? "فشل تحميل المنتجات" : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [limit, query, isRTL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {isRTL ? "لا توجد منتجات" : "No products found"}
        </h3>
        <p className="text-muted-foreground">
          {isRTL 
            ? "أخبرني بالمنتج الذي تريد إضافته وسعره" 
            : "Tell me what product you want to create and its price"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ShopifyProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
};
