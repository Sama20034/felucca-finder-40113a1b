import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, LogOut, X, Menu, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "@/assets/resilience-logo.png";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: isRTL ? 'الرئيسية' : 'Home', href: "/" },
    { name: isRTL ? 'المتجر' : 'Shop', href: "/shop" },
    { name: isRTL ? 'النتائج' : 'Results', href: "/results" },
    { name: isRTL ? 'الأسئلة الشائعة' : 'FAQ', href: "/faq" },
    { name: isRTL ? 'تواصل معنا' : 'Contact', href: "/contact" },
  ];

  const SuggestionsDropdown = () => (
    showSuggestions && (searchQuery.trim().length >= 2) && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-[100] max-h-80 overflow-y-auto backdrop-blur-md">
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
                className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-right first:rounded-t-2xl"
              >
                <img 
                  src={product.image_url} 
                  alt={isRTL ? product.name_ar : product.name}
                  className="w-12 h-12 object-cover rounded-xl border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {isRTL ? product.name_ar : product.name}
                  </p>
                  <p className="text-sm text-primary font-bold">
                    {product.price} {isRTL ? 'ج.م' : 'EGP'}
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={handleSearch}
              className="w-full p-4 text-center text-sm text-primary hover:bg-secondary/50 transition-colors border-t border-border rounded-b-2xl"
            >
              {isRTL ? `عرض كل النتائج` : `View all results`}
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              alt="Resilience Gold"
              className="h-12 md:h-14 w-auto transition-transform duration-500 group-hover:scale-105"
              src={logo}
            />
            <div className="hidden md:block">
              <h1 className="font-serif text-xl font-bold text-primary leading-none">Reselience</h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">Gold</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-card-foreground/80 hover:text-primary font-medium transition-colors duration-300 relative py-2
                  after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-primary after:rounded-full
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={isRTL ? 'ابحثي عن منتجاتك...' : 'Search products...'}
                  className="w-full py-3 px-5 rounded-full border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-card-foreground placeholder:text-muted-foreground"
                  style={{ paddingLeft: isRTL ? '3rem' : '1.25rem', paddingRight: isRTL ? '1.25rem' : '3rem' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors ${isRTL ? 'left-12' : 'right-12'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button 
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-accent transition-all shadow-gold ${isRTL ? 'left-1' : 'right-1'}`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <SuggestionsDropdown />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-secondary text-card-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-80 bg-background border-border">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-center py-8 border-b border-border">
                    <img src={logo} alt="Resilience Gold" className="h-16" />
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
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-card-foreground hover:text-primary hover:bg-secondary/50 rounded-xl font-medium transition-colors"
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
              className="relative hover:bg-secondary text-card-foreground hover:text-primary transition-colors"
              onClick={() => user ? navigate('/my-account?tab=wishlist') : navigate('/auth')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-secondary text-card-foreground hover:text-primary transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
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
                  className="hover:bg-secondary text-card-foreground hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="hover:bg-destructive/20 text-card-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/auth')}
                className="hover:bg-secondary text-card-foreground hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;