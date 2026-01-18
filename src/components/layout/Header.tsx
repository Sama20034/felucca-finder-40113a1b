import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, LogOut, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "@/assets/pink-wish-logo.png";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductSuggestion {
  id: number;
  name: string;
  name_ar: string;
  price: number;
  image_url: string;
}

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideSearchBar, setHideSearchBar] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Hide search bar when not at top of page
  useEffect(() => {
    const handleScroll = () => {
      // Only show search bar when at the very top (scrollY < 10)
      setHideSearchBar(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      const query = searchQuery.toLowerCase();
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, name_ar, price, image_url')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%`)
        .limit(5);

      if (!error && data) {
        setSuggestions(data);
      }
      setIsLoading(false);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
  };

  const navLinks = [
    { name: t('home'), href: "/" },
    { name: t('shop'), href: "/shop" },
    { name: t('categories'), href: "/categories" },
    { name: t('trackOrder'), href: "/track-order" },
    { name: t('contact'), href: "/contact" },
  ];

  const SuggestionsDropdown = () => (
    showSuggestions && (searchQuery.trim().length >= 2) && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-[100] max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {isRTL ? 'جاري البحث...' : 'Searching...'}
          </div>
        ) : suggestions.length > 0 ? (
          <>
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSuggestionClick(product.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-right"
              >
                <img 
                  src={product.image_url} 
                  alt={isRTL ? product.name_ar : product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {isRTL ? product.name_ar : product.name}
                  </p>
                  <p className="text-xs text-primary font-bold">
                    {product.price} {t('egp')}
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={handleSearch}
              className="w-full p-3 text-center text-sm text-primary hover:bg-accent transition-colors border-t border-border"
            >
              {isRTL ? `عرض كل النتائج لـ "${searchQuery}"` : `View all results for "${searchQuery}"`}
            </button>
          </>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {isRTL ? 'لا توجد نتائج' : 'No results found'}
          </div>
        )}
      </div>
    )
  );

  return (
    <header className="sticky top-0 z-50 bg-card/98 backdrop-blur-md shadow-soft border-b border-border/50">

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Left side */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              alt="Pink Wish"
              className="h-16 md:h-18 w-auto transition-transform duration-300 group-hover:scale-105"
              src={logo}
            />
          </Link>

          {/* Search Bar - Desktop (always visible) */}
          <div 
            ref={searchRef} 
            className="hidden md:flex flex-1 max-w-xl mx-8 relative"
          >
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t('searchProducts')}
                  className="w-full py-2 px-4 rounded-full border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                  style={{ paddingLeft: isRTL ? '2.5rem' : '1rem', paddingRight: isRTL ? '1rem' : '2.5rem' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${isRTL ? 'left-10' : 'right-10'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button 
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-all shadow-pink hover:shadow-pink-lg ${isRTL ? 'left-1' : 'right-1'}`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <SuggestionsDropdown />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile Menu Button - Right side */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-center py-6 border-b border-border">
                    <img src={logo} alt="Pink Wish" className="h-18" />
                  </div>
                  <nav className="flex flex-col gap-1 mt-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-foreground hover:text-primary hover:bg-accent rounded-lg font-medium transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent hover:text-primary transition-colors"
              onClick={() => user ? navigate('/my-account?tab=wishlist') : navigate('/auth')}
              title={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse-pink">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:text-primary transition-colors" title={t('cart')}>
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse-pink">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/my-account')}
                  title={t('myAccount')}
                  className="hover:bg-accent hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title={t('logout')}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/auth')}
                className="hover:bg-accent hover:text-primary transition-colors"
                title={t('login')}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div 
          ref={mobileSearchRef} 
          className={`md:hidden relative w-full overflow-hidden transition-all duration-300 ${hideSearchBar ? 'max-h-0 mt-0 opacity-0' : 'max-h-14 mt-2 pb-1 opacity-100'}`}
        >
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t('searchProducts')}
              className="w-full py-2 px-4 text-sm rounded-full border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              style={{ paddingLeft: isRTL ? '2.5rem' : '1rem', paddingRight: isRTL ? '1rem' : '2.5rem' }}
            />
            <button type="submit" className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}>
              <Search className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>
          </form>
          <SuggestionsDropdown />
        </div>
      </div>

      {/* Navigation - Desktop only */}
      <nav className="hidden md:block border-t border-border/50 bg-gradient-to-r from-accent/30 via-transparent to-accent/30">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="text-foreground hover:text-primary font-medium transition-all duration-300 relative py-2 px-1
                    after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-primary after:rounded-full
                    hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
