import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, Beaker, Sparkles, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductData {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
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
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
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

interface ProductDetails {
  how_to_use: string | null;
  how_it_works: string | null;
  ingredients: string | null;
}

const ShopifyProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { isRTL } = useLanguage();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'how_to_use' | 'how_it_works' | 'ingredients'>('description');
  const addItem = useCartStore(state => state.addItem);
  const getCheckoutUrl = useCartStore(state => state.getCheckoutUrl);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        // Fetch Shopify product
        const shopifyData = await fetchProductByHandle(handle);
        setProduct(shopifyData);
        
        if (shopifyData?.variants?.edges?.[0]) {
          setSelectedVariant(shopifyData.variants.edges[0].node.id);
        }

        // Fetch product details from Supabase (don't throw if not found)
        const { data: detailsData, error } = await supabase
          .from('product_details')
          .select('how_to_use, how_it_works, ingredients')
          .eq('shopify_handle', handle)
          .maybeSingle();
        
        if (!error && detailsData) {
          setProductDetails(detailsData);
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

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;
    
    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    setIsBuyingNow(true);
    try {
      await addItem({
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity,
        selectedOptions: variant.selectedOptions || []
      });
      
      // Wait a moment for the cart to be created/updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const checkoutUrl = getCheckoutUrl();
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      }
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ" : "Failed to proceed to checkout");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const currentVariant = product?.variants.edges.find(v => v.node.id === selectedVariant)?.node;

  const tabs = [
    { id: 'description' as const, label: isRTL ? 'الوصف' : 'Description', icon: null },
    ...(productDetails?.how_to_use ? [{ id: 'how_to_use' as const, label: isRTL ? 'طريقة الاستخدام' : 'How to Use', icon: Beaker }] : []),
    ...(productDetails?.how_it_works ? [{ id: 'how_it_works' as const, label: isRTL ? 'كيف يعمل' : 'How it Works', icon: Sparkles }] : []),
    ...(productDetails?.ingredients ? [{ id: 'ingredients' as const, label: isRTL ? 'المكونات' : 'Ingredients', icon: Leaf }] : []),
  ];

  const decodeHtmlEntities = (html: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  const formatPlainText = (text: string): string => {
    // Convert plain text to HTML preserving line breaks and structure
    return text
      .split('\n')
      .map(line => line.trim())
      .filter((line, idx, arr) => !(line === '' && idx > 0 && arr[idx - 1] === ''))
      .map(line => {
        if (line === '') return '<br/>';
        return `<p>${line}</p>`;
      })
      .join('');
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'how_to_use':
        return productDetails?.how_to_use ? formatPlainText(productDetails.how_to_use) : null;
      case 'how_it_works':
        return productDetails?.how_it_works ? formatPlainText(productDetails.how_it_works) : null;
      case 'ingredients':
        return productDetails?.ingredients ? formatPlainText(productDetails.ingredients) : null;
      default: {
        const html = product?.descriptionHtml || product?.description;
        return html ? decodeHtmlEntities(html) : null;
      }
    }
  };

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
            <div className="aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              {product.images.edges[selectedImage] ? (
                <img
                  src={product.images.edges[selectedImage].node.url}
                  alt={product.images.edges[selectedImage].node.altText || product.title}
                  className="w-full h-full object-contain"
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
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-primary">
                {currentVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode}{' '}
                {parseFloat(currentVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}
              </span>
              {currentVariant?.compareAtPrice && parseFloat(currentVariant.compareAtPrice.amount) > parseFloat(currentVariant.price.amount) && (
                <span className="text-lg text-muted-foreground line-through">
                  {currentVariant.compareAtPrice.currencyCode}{' '}
                  {parseFloat(currentVariant.compareAtPrice.amount).toFixed(2)}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="gap-2"
                  >
                    {tab.icon && <tab.icon className="w-4 h-4" />}
                    {tab.label}
                  </Button>
                ))}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 sm:p-5 min-h-[100px] overflow-hidden">
                {getTabContent() ? (
              <div 
                    className="text-foreground/80 max-w-none space-y-3 break-words overflow-hidden
                      [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-5 [&>h3]:mb-2
                      [&>p]:leading-relaxed [&>p]:mb-3 [&>p]:break-words
                      [&>ul]:list-disc [&>ul]:ps-6 [&>ul]:space-y-1.5 [&>ul]:mb-3
                      [&>ol]:list-decimal [&>ol]:ps-6 [&>ol]:space-y-1.5 [&>ol]:mb-3
                      [&_li]:leading-relaxed [&_li]:break-words
                      [&_strong]:text-foreground [&_strong]:font-semibold
                      first:[&>h3]:mt-0"
                    dangerouslySetInnerHTML={{ __html: getTabContent()! }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {isRTL ? 'لا توجد معلومات' : 'No information available'}
                  </p>
                )}
              </div>
            </div>

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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || isBuyingNow || !currentVariant?.availableForSale}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-full"
                size="lg"
              >
                {isAdding ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isRTL ? "أضف للسلة" : "ADD TO CART"}
                  </>
                )}
              </Button>

              {/* Buy Now */}
              <Button
                onClick={handleBuyNow}
                disabled={isAdding || isBuyingNow || !currentVariant?.availableForSale}
                variant="outline"
                className="flex-1 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background py-6 text-lg rounded-full"
                size="lg"
              >
                {isBuyingNow ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {isRTL ? "اشتري الآن" : "BUY IT NOW"}
                  </>
                )}
              </Button>
            </div>

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