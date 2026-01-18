import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Search, X, Sparkles, Crown, Star, Heart, ShoppingCart, Droplet, Gem } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";

// Static products for hair oils and accessories
const staticProducts = [
  {
    id: "oil-1",
    name: "Golden Argan Elixir",
    name_ar: "إكسير الأرجان الذهبي",
    description: "زيت أرجان نقي 100% للترطيب العميق",
    price: 450,
    original_price: 550,
    image_url: "/assets/products/product-1.jpg",
    category: "oils",
    rating: 4.9,
    reviews: 128,
    benefits: ["ترطيب عميق", "لمعان طبيعي", "تقوية الجذور"]
  },
  {
    id: "oil-2",
    name: "Royal Castor Oil",
    name_ar: "زيت الخروع الملكي",
    description: "زيت خروع عضوي لتطويل الشعر",
    price: 320,
    original_price: 400,
    image_url: "/assets/products/product-2.jpg",
    category: "oils",
    rating: 4.8,
    reviews: 95,
    benefits: ["تطويل الشعر", "كثافة أكثر", "علاج التساقط"]
  },
  {
    id: "oil-3",
    name: "Coconut Gold Serum",
    name_ar: "سيروم جوز الهند الذهبي",
    description: "سيروم مغذي بجوز الهند والذهب",
    price: 580,
    original_price: null,
    image_url: "/assets/products/product-3.jpg",
    category: "oils",
    rating: 5.0,
    reviews: 67,
    benefits: ["تغذية مكثفة", "نعومة فائقة", "حماية حرارية"]
  },
  {
    id: "oil-4",
    name: "Rosemary Growth Oil",
    name_ar: "زيت الروزماري للنمو",
    description: "زيت روزماري لتحفيز نمو الشعر",
    price: 380,
    original_price: 450,
    image_url: "/assets/products/product-4.jpg",
    category: "oils",
    rating: 4.7,
    reviews: 156,
    benefits: ["تحفيز النمو", "تقوية البصيلات", "منع القشرة"]
  },
  {
    id: "acc-1",
    name: "Silk Scrunchie Set",
    name_ar: "طقم ربطات الحرير",
    description: "ربطات شعر حريرية فاخرة",
    price: 180,
    original_price: 220,
    image_url: "/assets/products/product-5.jpg",
    category: "accessories",
    rating: 4.9,
    reviews: 89,
    benefits: ["لا تكسر الشعر", "أناقة فاخرة", "راحة طوال اليوم"]
  },
  {
    id: "acc-2",
    name: "Golden Hair Claw",
    name_ar: "مشبك الشعر الذهبي",
    description: "مشبك شعر ذهبي فاخر",
    price: 250,
    original_price: null,
    image_url: "/assets/products/product-6.jpg",
    category: "accessories",
    rating: 4.8,
    reviews: 72,
    benefits: ["تصميم أنيق", "قبضة قوية", "لمسة ملكية"]
  },
  {
    id: "oil-5",
    name: "Lavender Dream Oil",
    name_ar: "زيت اللافندر الحالم",
    description: "زيت لافندر للاسترخاء والتغذية",
    price: 420,
    original_price: 500,
    image_url: "/assets/products/product-1.jpg",
    category: "oils",
    rating: 4.6,
    reviews: 103,
    benefits: ["استرخاء", "رائحة مميزة", "تغذية ليلية"]
  },
  {
    id: "acc-3",
    name: "Pearl Hair Pins",
    name_ar: "دبابيس اللؤلؤ",
    description: "دبابيس شعر باللؤلؤ الطبيعي",
    price: 320,
    original_price: 380,
    image_url: "/assets/products/product-2.jpg",
    category: "accessories",
    rating: 4.9,
    reviews: 45,
    benefits: ["أناقة ملكية", "تثبيت مثالي", "لمسة كلاسيكية"]
  }
];

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = [
    { id: "all", name: "All Products", name_ar: "جميع المنتجات", icon: Crown },
    { id: "oils", name: "Hair Oils", name_ar: "زيوت الشعر", icon: Droplet },
    { id: "accessories", name: "Accessories", name_ar: "إكسسوارات", icon: Gem }
  ];

  const filteredProducts = useMemo(() => {
    let result = [...staticProducts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.name_ar.includes(query)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    return result;
  }, [searchQuery, selectedCategory, priceRange]);

  const handleWishlistToggle = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
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
            placeholder={isRTL ? 'ابحثي عن منتجك...' : 'Find your treasure...'}
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
          max={1000}
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
            <span className="text-foreground">{isRTL ? 'كنوز' : 'Treasures'}</span>
            <br />
            <span className="text-gradient-gold">{isRTL ? 'الجمال الذهبي' : 'of Golden Beauty'}</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {isRTL 
              ? 'اكتشفي مجموعتنا الفاخرة من زيوت الشعر الطبيعية وإكسسوارات الأناقة'
              : 'Discover our luxurious collection of natural hair oils and elegant accessories'}
          </p>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-8">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full mx-auto flex justify-center">
              <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative px-8 py-4 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)]'
                      : 'bg-card/50 border-border/30 text-muted-foreground hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-medium">{isRTL ? cat.name_ar : cat.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
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
                    {filteredProducts.length} {isRTL ? 'منتج' : 'treasures'}
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

              {/* Products Grid - Unique Layout */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Crown className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {isRTL ? 'لا توجد منتجات تطابق بحثك' : 'No treasures match your search'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => {
                    const discount = product.original_price 
                      ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
                      : 0;
                    const inWishlist = isInWishlist(product.id);
                    const isHovered = hoveredProduct === product.id;

                    return (
                      <div
                        key={product.id}
                        className="group relative"
                        onMouseEnter={() => setHoveredProduct(product.id)}
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
                          <div className="relative aspect-[4/5] overflow-hidden">
                            <img
                              src={product.image_url}
                              alt={isRTL ? product.name_ar : product.name}
                              className={`w-full h-full object-cover transition-all duration-700 ${
                                isHovered ? 'scale-110' : 'scale-100'
                              }`}
                            />

                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-purple-dark/90 via-purple-dark/20 to-transparent transition-opacity duration-500 ${
                              isHovered ? 'opacity-100' : 'opacity-60'
                            }`} />

                            {/* Discount Badge */}
                            {discount > 0 && (
                              <div className="absolute top-4 right-4 z-10">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-primary blur-lg opacity-50" />
                                  <div className="relative bg-gradient-to-r from-primary to-gold text-primary-foreground text-sm font-bold px-4 py-2 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    -{discount}%
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4 z-10">
                              <div className="bg-background/80 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20">
                                {product.category === 'oils' 
                                  ? (isRTL ? 'زيوت' : 'Oil') 
                                  : (isRTL ? 'إكسسوار' : 'Accessory')}
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 transition-all duration-500 ${
                              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                            }`}>
                              <button
                                onClick={() => handleWishlistToggle(product.id)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                                  inWishlist 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-white/10 text-white hover:bg-primary hover:text-primary-foreground'
                                }`}
                              >
                                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={() => addToCart(product.id, 1)}
                                className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]"
                              >
                                <ShoppingCart className="w-6 h-6" />
                              </button>
                            </div>

                            {/* Product Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              {/* Rating */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(product.rating)
                                          ? 'fill-primary text-primary'
                                          : 'fill-muted/30 text-muted/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-white/60 text-sm">({product.reviews})</span>
                              </div>

                              {/* Name */}
                              <h3 className="font-serif text-xl font-bold text-white mb-2 line-clamp-1">
                                {isRTL ? product.name_ar : product.name}
                              </h3>

                              {/* Description */}
                              <p className="text-white/60 text-sm mb-4 line-clamp-1">
                                {product.description}
                              </p>

                              {/* Price */}
                              <div className="flex items-baseline gap-3">
                                <span className="text-2xl font-bold text-primary">
                                  {product.price} <span className="text-sm">{isRTL ? 'ج.م' : 'EGP'}</span>
                                </span>
                                {product.original_price && (
                                  <span className="text-white/40 text-sm line-through">
                                    {product.original_price} {isRTL ? 'ج.م' : 'EGP'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Benefits Section */}
                          <div className={`bg-card/80 backdrop-blur-sm border-t border-border/30 p-4 transition-all duration-500 ${
                            isHovered ? 'opacity-100' : 'opacity-90'
                          }`}>
                            <div className="flex flex-wrap gap-2">
                              {product.benefits.map((benefit, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Glow Effect */}
                        <div className={`absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl transition-opacity duration-700 -z-10 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-dark via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.1),transparent_70%)]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Crown className="w-12 h-12 text-primary mx-auto mb-6 animate-float" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">{isRTL ? 'لم تجدي ما تبحثين عنه؟' : "Didn't find what you're looking for?"}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            {isRTL 
              ? 'تواصلي معنا وسنساعدك في إيجاد المنتج المثالي لشعرك'
              : 'Contact us and we will help you find the perfect product for your hair'}
          </p>
          <Link to="/contact">
            <Button size="lg" className="btn-luxury text-lg px-10 py-6">
              {isRTL ? 'تواصلي معنا' : 'Contact Us'}
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;