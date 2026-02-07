import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, LogOut, X, Menu, Crown, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { useQuery } from "@tanstack/react-query";
import { fetchShopifyCollections, ShopifyCollection } from "@/lib/shopify";
import LanguageSwitcher from "./LanguageSwitcher";
import { CartDrawer } from "@/components/shopify/CartDrawer";
import CategoriesBar from "./CategoriesBar";
import logo from "@/assets/reselience-flowers-logo.png";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, isRTL } = useLanguage();
  const shopifyCartTotal = useCartStore(state => state.getTotalItems());
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch Shopify collections for mobile menu
  const { data: collections = [] } = useQuery({
    queryKey: ['shopify-collections-menu'],
    queryFn: () => fetchShopifyCollections(10),
    staleTime: 1000 * 60 * 5,
  });

  // Filter out "home" collection
  const menuCollections = collections.filter(
    (col: ShopifyCollection) => !col.node.title.toLowerCase().includes('home')
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const navLinks = [
    { name: isRTL ? 'الرئيسية' : 'Home', href: "/" },
    { name: isRTL ? 'المتجر' : 'Shop', href: "/shop" },
    { name: isRTL ? 'الأسئلة الشائعة' : 'FAQ', href: "/faq" },
    { name: isRTL ? 'تواصل معنا' : 'Contact', href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#1C092F] ${
      isScrolled 
        ? 'shadow-lg border-b border-[#D4AF37]/20' 
        : ''
    }`}>
      {/* Mobile Header - Single row layout */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 border-0 bg-transparent h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "right" : "left"} className="w-80 bg-background border-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center py-6 border-b border-[#D4AF37]/20 bg-[#1C092F]">
                  <img src={logo} alt="Reselience Gold" className="h-14" />
                </div>
                
                {/* Mobile Search */}
                <div className="p-4 border-b border-border">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isRTL ? 'ابحثي...' : 'Search...'}
                        className="w-full py-3 px-4 rounded-xl border border-border bg-secondary/30 focus:outline-none focus:border-primary text-card-foreground"
                      />
                      <button type="submit" className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}>
                        <Search className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </form>
                </div>

                <nav className="flex flex-col gap-2 p-4">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-card-foreground hover:text-primary hover:bg-secondary/50 rounded-xl font-medium transition-colors block"
                      >
                        {link.name}
                      </Link>
                      
                      {/* Dynamic Categories Sub-menu under Shop */}
                      {link.href === "/shop" && menuCollections.length > 0 && (
                        <div className={`mt-1 flex flex-col gap-1 border-primary/20 ${isRTL ? 'mr-4 border-r-2 pr-3' : 'ml-4 border-l-2 pl-3'}`}>
                          {menuCollections.map((collection: ShopifyCollection) => (
                            <Link
                              key={collection.node.id}
                              to={`/shop?collection=${collection.node.handle}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 rounded-lg transition-colors"
                            >
                              <span className="text-primary">•</span>
                              {collection.node.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Centered and larger */}
          <Link to="/" className="flex items-center group flex-1 justify-center">
            <img
              alt="Reselience Gold"
              className="h-14 sm:h-16 w-auto transition-transform duration-500 group-hover:scale-105"
              src={logo}
            />
          </Link>

          {/* Right - Minimal Icons */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            
            {/* Shopify Cart Drawer */}
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              alt="Reselience Gold"
              className="h-16 w-auto transition-transform duration-500 group-hover:scale-105"
              src={logo}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-white/80 hover:text-white font-medium transition-colors duration-300 relative py-2
                  after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-white after:rounded-full
                  hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div 
            ref={searchRef} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'ابحثي عن منتجاتك...' : 'Search products...'}
                  className="w-full py-3 px-5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all text-white placeholder:text-white/60"
                  style={{ paddingLeft: isRTL ? '3rem' : '1.25rem', paddingRight: isRTL ? '1.25rem' : '3rem' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors ${isRTL ? 'left-12' : 'right-12'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button 
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-all ${isRTL ? 'left-1' : 'right-1'}`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher />
            
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/10 text-white transition-colors h-9 w-9 md:h-10 md:w-10"
              onClick={() => user ? navigate('/my-account?tab=wishlist') : navigate('/auth')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#1C092F] text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs">
                  {wishlistCount}
                </span>
              )}
            </Button>
            
            {/* Shopify Cart Drawer */}
            <CartDrawer />
            
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/my-account')}
                  className="hover:bg-white/10 text-white transition-colors h-9 w-9 md:h-10 md:w-10"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="hidden md:flex hover:bg-red-500/20 text-white hover:text-red-400 transition-colors h-9 w-9 md:h-10 md:w-10"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/auth')}
                className="hover:bg-white/10 text-white transition-colors h-9 w-9 md:h-10 md:w-10"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar - Below Header */}
      <CategoriesBar />
    </header>
  );
};

export default Header;
