import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

interface ProductData {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const ShopifyProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { isRTL } = useLanguage();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants?.edges?.[0]) {
          setSelectedVariant(data.variants.edges[0].node.id);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    
    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    setIsAdding(true);
    try {
      await addItem({
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity,
        selectedOptions: variant.selectedOptions || []
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

  const currentVariant = product?.variants.edges.find(v => v.node.id === selectedVariant)?.node;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {isRTL ? "المنتج غير موجود" : "Product not found"}
          </h1>
          <Link to="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isRTL ? "العودة للمتجر" : "Back to Shop"}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/shop" className="text-muted-foreground hover:text-primary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isRTL ? "العودة للمتجر" : "Back to Shop"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              {product.images.edges[selectedImage] ? (
                <img
                  src={product.images.edges[selectedImage].node.url}
                  alt={product.images.edges[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {product.images.edges.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.edges.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
            
            <div className="text-2xl font-bold text-primary">
              {currentVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode}{' '}
              {parseFloat(currentVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Variants */}
            {product.options.map((option) => (
              <div key={option.name} className="space-y-2">
                <label className="font-medium text-foreground">{option.name}</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges
                    .filter(v => v.node.selectedOptions.some(o => o.name === option.name))
                    .map((variant) => {
                      const optionValue = variant.node.selectedOptions.find(o => o.name === option.name)?.value;
                      return (
                        <button
                          key={variant.node.id}
                          onClick={() => setSelectedVariant(variant.node.id)}
                          disabled={!variant.node.availableForSale}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedVariant === variant.node.id
                              ? 'border-primary bg-primary text-primary-foreground'
                              : variant.node.availableForSale
                                ? 'border-border hover:border-primary'
                                : 'border-border opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {optionValue}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="font-medium text-foreground">
                {isRTL ? "الكمية" : "Quantity"}
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || !currentVariant?.availableForSale}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
              size="lg"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isRTL ? "أضف للسلة" : "Add to Cart"}
                </>
              )}
            </Button>

            {!currentVariant?.availableForSale && (
              <p className="text-destructive text-center">
                {isRTL ? "هذا المنتج غير متوفر حالياً" : "This product is currently out of stock"}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopifyProductPage;