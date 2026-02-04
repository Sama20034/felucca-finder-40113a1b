import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const { isRTL } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  
  const firstVariant = product.node.variants.edges[0]?.node;
  const firstImage = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;
    
    setIsAdding(true);
    try {
      await addItem({
        product,
        variantId: firstVariant.id,
        variantTitle: firstVariant.title,
        price: firstVariant.price,
        quantity: 1,
        selectedOptions: firstVariant.selectedOptions || []
      });
      toast.success(isRTL ? "تمت الإضافة للسلة" : "Added to cart", {
        position: "top-center"
      });
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ" : "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link 
      to={`/shopify-product/${product.node.handle}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        {firstImage ? (
          <>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={firstImage.url}
              alt={firstImage.altText || product.node.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Add to Cart Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || !firstVariant?.availableForSale}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isRTL ? "أضف للسلة" : "Add to Cart"}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.node.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.node.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          {!firstVariant?.availableForSale && (
            <span className="text-xs text-destructive">
              {isRTL ? "غير متوفر" : "Out of stock"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
