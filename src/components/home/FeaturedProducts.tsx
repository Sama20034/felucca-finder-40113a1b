import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/stores/cartStore';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

const FeaturedProducts = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { addItem, isLoading: cartLoading } = useCartStore();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts(8);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    setAddingToCart(product.node.id);
    try {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || []
      });
      toast.success(isRTL ? "تمت الإضافة للسلة" : "Added to cart");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ" : "Error adding to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // No products
  if (products.length === 0) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isRTL ? "لا توجد منتجات بعد" : "No products yet"}
          </h3>
          <p className="text-muted-foreground">
            {isRTL 
              ? "سيتم عرض المنتجات هنا بمجرد إضافتها" 
              : "Products will appear here once added"
            }
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              {isRTL ? 'منتجاتنا المميزة' : 'Featured Products'}
            </h2>
            <p className="text-muted-foreground">
              {isRTL ? 'اكتشفي منتجاتنا الفاخرة' : 'Discover our premium products'}
            </p>
          </div>
          <Link to="/shop">
            <Button variant="outline" className="btn-outline-beauty">
              {isRTL ? 'عرض الكل' : 'View All'}
              {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
            const currency = product.node.priceRange.minVariantPrice.currencyCode;
            const imageUrl = product.node.images.edges[0]?.node.url;
            const isAddingThis = addingToCart === product.node.id;

            return (
              <motion.div
                key={product.node.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div 
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                    className="block relative cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}

                      {/* Quick Add Button - Visible on hover */}
                      <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={isAddingThis || cartLoading}
                          size="sm" 
                          className="btn-beauty shadow-lg"
                        >
                          {isAddingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 mr-1" />
                              {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Name */}
                    <div 
                      onClick={() => navigate(`/product/${product.node.handle}`)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
                        {product.node.title}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {price.toFixed(0)} {currency === 'EGP' ? (isRTL ? 'ج.م' : 'EGP') : currency}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
