import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Search, X, Sparkles, Crown, Star, Heart, ShoppingCart, Loader2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { fetchShopifyProducts, fetchProductsByCollection, fetchShopifyCollections, ShopifyProduct, ShopifyCollection } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import homeCollectionBg from "@/assets/home-collection-bg.png";

const Shop = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();
  const { addItem, isLoading: cartLoading } = useCartStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Shopify products state
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Get collection filter from URL
  const collectionHandle = searchParams.get('collection');

  // Fetch collections from Shopify
  useEffect(() => {
    const loadCollections = async () => {
      setCollectionsLoading(true);
      try {
        const data = await fetchShopifyCollections(20);
        setCollections(data);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setCollectionsLoading(false);
      }
    };
    loadCollections();
  }, []);

  // Fetch products from Shopify
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: ShopifyProduct[];
        if (collectionHandle) {
          // Fetch products from specific collection
          data = await fetchProductsByCollection(collectionHandle, 50);
        } else {
          // Fetch all products
          data = await fetchShopifyProducts(50);
        }
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(isRTL ? "فشل تحميل المنتجات" : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [isRTL, collectionHandle]);

  // Get current collection name
  const currentCollectionName = useMemo(() => {
    if (!collectionHandle) return null;
    const collection = collections.find(c => c.node.handle === collectionHandle);
    return collection?.node.title || collectionHandle;
  }, [collectionHandle, collections]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.node.title.toLowerCase().includes(query) ||
        p.node.description?.toLowerCase().includes(query)
      );
    }

    result = result.filter(p => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    return result;
  }, [searchQuery, priceRange, products]);

  const handleAddToCart = async (product: ShopifyProduct) => {
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

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-primary flex items-center gap-2">
          <Search className="w-4 h-4" />
          {isRTL ? 'البحث' : 'Search'}
        </label>
        <div className="relative">
          <Input
            placeholder={isRTL ? 'ابحثي عن منتجك...' : 'Find your product...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card/50 border-primary/20 focus:border-primary pl-4 pr-4"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {isRTL ? 'نطاق السعر' : 'Price Range'}
        </label>
        <Slider
          min={0}
          max={2000}
          step={50}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mt-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]} {isRTL ? 'ج.م' : 'EGP'}</span>
          <span>{priceRange[1]} {isRTL ? 'ج.م' : 'EGP'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cinematic Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-dark via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_70%)]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">{isRTL ? 'مجموعة حصرية' : 'Exclusive Collection'}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="text-foreground">{isRTL ? 'منتجاتنا' : 'Our Products'}</span>
            <br />
            <span className="text-gradient-gold">{isRTL ? 'الفاخرة' : 'Premium'}</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {isRTL 
              ? 'اكتشفي مجموعتنا الفاخرة من منتجات العناية بالبشرة والجمال'
              : 'Discover our luxurious collection of skincare and beauty products'}
          </p>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-8">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full mx-auto flex justify-center">
              <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>


      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-12">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 card-luxury p-6">
                <h3 className="font-serif text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {isRTL ? 'تصفية' : 'Refine'}
                </h3>
                <FiltersContent />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {loading ? '...' : filteredProducts.length} {isRTL ? 'منتج' : 'products'}
                  </span>
                </div>

                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-primary/30 hover:border-primary">
                      <Filter className="w-4 h-4 mr-2" />
                      {isRTL ? 'تصفية' : 'Filter'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={isRTL ? "right" : "left"} className="bg-background border-border">
                    <SheetHeader>
                      <SheetTitle className="text-primary">{isRTL ? 'تصفية المنتجات' : 'Filter Products'}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-20">
                  <p className="text-destructive">{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isRTL ? "لا توجد منتجات بعد" : "No products yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? "أخبرني بالمنتج الذي تريد إضافته وسعره" 
                      : "Tell me what product you want to create and its price"
                    }
                  </p>
                </div>
              )}

              {/* No Results from Filter */}
              {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <Crown className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {isRTL ? 'لا توجد منتجات تطابق بحثك' : 'No products match your search'}
                  </p>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => {
                    const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
                    const currency = product.node.priceRange.minVariantPrice.currencyCode;
                    const imageUrl = product.node.images.edges[0]?.node.url;
                    const isHovered = hoveredProduct === product.node.id;
                    const isAddingThis = addingToCart === product.node.id;

                    return (
                      <div
                        key={product.node.id}
                        className="group relative"
                        onMouseEnter={() => setHoveredProduct(product.node.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Card */}
                        <div className={`relative bg-card rounded-3xl overflow-hidden border transition-all duration-700 ${
                          isHovered 
                            ? 'border-primary shadow-[0_30px_60px_-15px_hsl(var(--primary)/0.3)] -translate-y-3' 
                            : 'border-border/30 shadow-lg'
                        }`}>
                          {/* Image Section */}
                          <div 
                            className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                            onClick={() => navigate(`/product/${product.node.handle}`)}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.node.title}
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                  isHovered ? 'scale-110' : 'scale-100'
                                }`}
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}

                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-purple-dark/90 via-purple-dark/20 to-transparent transition-opacity duration-500 ${
                              isHovered ? 'opacity-100' : 'opacity-60'
                            }`} />

                            {/* Content on Image */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <h3 className="font-serif text-xl font-bold text-white mb-2 line-clamp-2">
                                {product.node.title}
                              </h3>
                              
                              {product.node.description && (
                                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                                  {product.node.description}
                                </p>
                              )}

                              {/* Price */}
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-white">
                                  {price.toFixed(0)} <span className="text-sm">{currency === 'EGP' ? 'ج.م' : currency}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="p-4 border-t border-border/30">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={isAddingThis || cartLoading}
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              {isAddingThis ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              {isRTL ? 'لم تجدي ما تبحثين عنه؟' : "Didn't Find What You're Looking For?"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isRTL 
                ? 'تواصلي معنا وسنساعدك في العثور على المنتج المثالي لك'
                : "Contact us and we'll help you find the perfect product for you"}
            </p>
            <Link to="/contact">
              <Button size="lg" className="btn-luxury">
                <Sparkles className="w-5 h-5 mr-2" />
                {isRTL ? 'تواصلي معنا' : 'Contact Us'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
