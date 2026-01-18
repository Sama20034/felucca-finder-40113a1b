import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/home/ProductCard';
import { ProductReviews } from '@/components/product/ProductReviews';
import { Minus, Plus, ShoppingCart, Heart, Star, Award, Ruler } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ColorOption {
  name: string;
  name_ar: string;
  hex: string;
}

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[] | null;
  stock_quantity: number;
  badge?: string;
  rating?: number;
  category_id?: string;
  loyalty_points?: number;
  sizes?: string[] | null;
  colors?: ColorOption[] | null;
  size_guide_image?: string | null;
  length?: string | null;
  length_ar?: string | null;
  material?: string | null;
  material_ar?: string | null;
  related_products?: number[] | null;
  is_returnable?: boolean | null;
  categories?: {
    name: string;
    name_ar: string;
  };
}

interface RelatedProduct {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[] | null;
  sizes?: string[] | null;
  colors?: ColorOption[] | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, name_ar)')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/shop');
        return;
      }
      setProduct(data as unknown as Product);
      
      // Fetch related products if available
      if (data.related_products && data.related_products.length > 0) {
        const { data: related, error: relatedError } = await supabase
          .from('products')
          .select('id, name, name_ar, price, original_price, image_url, images, sizes, colors')
          .in('id', data.related_products)
          .eq('is_active', true);

        if (!relatedError && related) {
          setRelatedProducts(related as unknown as RelatedProduct[]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: t('error'),
        description: isRTL ? 'فشل تحميل المنتج' : 'Failed to load product',
        variant: 'destructive',
      });
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    addToWishlist(product.id);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-muted-foreground">
            {isRTL ? 'المنتج غير موجود' : 'Product not found'}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                {(() => {
                  const allImages = product.images && product.images.length > 0 
                    ? [product.image_url, ...product.images] 
                    : [product.image_url];
                  return (
                    <>
                      <img
                        src={allImages[selectedImageIndex] || product.image_url}
                        alt={isRTL ? product.name_ar : product.name}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      {product.badge && (
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                          {product.badge}
                        </Badge>
                      )}
                      {discount > 0 && (
                        <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                          {isRTL ? `خصم ${discount}%` : `${discount}% OFF`}
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[product.image_url, ...product.images].map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${isRTL ? product.name_ar : product.name} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {isRTL ? product.name_ar : product.name}
                </h1>
                {product.categories && (
                  <p className="text-muted-foreground">
                    {isRTL ? product.categories.name_ar : product.categories.name}
                  </p>
                )}
              {/* Length */}
              {(product.length || product.length_ar) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {isRTL ? 'الطول:' : 'Length:'} {isRTL ? product.length_ar : product.length}
                </p>
              )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < product.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating} {isRTL ? 'من 5' : 'out of 5'})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toFixed(2)} {t('egp')}
                </span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.original_price.toFixed(2)} {t('egp')}
                  </span>
                )}
              </div>

              {/* Loyalty Points */}
              {product.loyalty_points && product.loyalty_points > 0 && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">
                      {isRTL ? 'متاح للاستبدال بنقاط الولاء' : 'Available with loyalty points'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isRTL 
                      ? <>يمكنك استبدال هذا المنتج بـ <span className="font-bold text-primary">{product.loyalty_points}</span> نقطة ولاء</>
                      : <>Redeem this product for <span className="font-bold text-primary">{product.loyalty_points}</span> loyalty points</>
                    }
                  </p>
                </div>
              )}

              {/* Material */}
              {(product.material || product.material_ar) && (
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'الخامة:' : 'Material:'} {isRTL ? product.material_ar : product.material}
                </p>
              )}

              {/* Available Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground font-medium">
                      {isRTL ? 'المقاس' : 'Size'}
                    </Label>
                    {product.size_guide_image && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" size="sm" className="gap-1 h-auto p-0">
                            <Ruler className="w-4 h-4" />
                            {isRTL ? 'دليل المقاسات' : 'Size Guide'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{isRTL ? 'دليل المقاسات' : 'Size Guide'}</DialogTitle>
                          </DialogHeader>
                          <img 
                            src={product.size_guide_image} 
                            alt="Size Guide" 
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    {isRTL ? 'اللون' : 'Color'}
                    {selectedColor && (
                      <span className="font-normal text-muted-foreground ml-2">
                        - {isRTL ? selectedColor.name_ar : selectedColor.name}
                      </span>
                    )}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor?.hex === color.hex 
                            ? 'border-primary ring-2 ring-primary ring-offset-2' 
                            : 'border-border'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color)}
                        title={isRTL ? color.name_ar : color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {(product.description_ar || product.description) && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    {isRTL ? product.description_ar : product.description}
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <div>
                {product.stock_quantity > 0 ? (
                  <p className="text-green-600 font-medium">
                    {t('inStock')}
                  </p>
                ) : (
                  <p className="text-destructive font-medium">{t('outOfStock')}</p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock_quantity > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-foreground font-medium">{t('quantity')}:</span>
                  <div className="flex items-center gap-3 border border-border rounded-lg p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('addToCart')}
                </Button>
                <Button
                  variant={inWishlist ? "default" : "outline"}
                  size="lg"
                  onClick={handleAddToWishlist}
                  title={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-border space-y-2 text-sm text-muted-foreground">
                <p>✓ {isRTL ? 'شحن مجاني للطلبات فوق 500 ج.م' : 'Free shipping on orders over 500 EGP'}</p>
                {product.is_returnable !== false ? (
                  <p>✓ {isRTL ? 'إمكانية الإرجاع خلال 7 أيام' : '7-day return policy'}</p>
                ) : (
                  <p className="text-destructive font-medium">✗ {isRTL ? 'هذا المنتج غير قابل للإرجاع' : 'This product is non-returnable'}</p>
                )}
                <p>✓ {isRTL ? 'الدفع عند الاستلام' : 'Cash on delivery'}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isRTL ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
            </h2>
            <ProductReviews productId={Number(product.id)} />
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isRTL ? 'منتجات ذات صلة' : 'Related Products'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={isRTL ? relatedProduct.name_ar : relatedProduct.name}
                    price={relatedProduct.price}
                    originalPrice={relatedProduct.original_price || undefined}
                    image={relatedProduct.image_url}
                    images={relatedProduct.images}
                    sizes={relatedProduct.sizes}
                    colors={relatedProduct.colors}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

// Label component for this page
const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`block text-sm ${className}`}>{children}</span>
);

export default ProductDetail;