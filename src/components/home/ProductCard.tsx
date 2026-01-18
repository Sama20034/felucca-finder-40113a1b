import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, Eye, Star, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ColorOption {
  name: string;
  name_ar: string;
  hex: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  nameAr?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[] | null;
  badge?: string;
  rating?: number;
  loyaltyPoints?: number;
  sizes?: string[] | null;
  colors?: ColorOption[] | null;
}

const ProductCard = ({ id, name, nameAr, price, originalPrice, image, images, badge, rating = 4.5, loyaltyPoints, sizes, colors }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get all available images - main image first, then additional images
  const allImages = [image, ...(images || []).filter(img => img !== image)];
  
  // Auto-cycle images on hover
  useEffect(() => {
    if (isHovering && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, allImages.length]);
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const inWishlist = isInWishlist(id);

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(id, 1, { size: selectedSize, color: selectedColor });
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setSelectedSize(selectedSize === size ? null : size);
  };

  const handleColorSelect = (e: React.MouseEvent, color: ColorOption) => {
    e.stopPropagation();
    setSelectedColor(selectedColor?.hex === color.hex ? null : color);
  };

  const handleViewProduct = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <div 
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/30 transition-all duration-500 cursor-pointer
        hover:shadow-[0_20px_50px_-15px_hsl(var(--primary)/0.25)] hover:border-primary/40 hover:-translate-y-2"
      onClick={handleViewProduct}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      
      {/* Image Container - 3:4 aspect ratio */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted to-muted/50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={allImages[currentImageIndex] || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Image indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            {allImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-md opacity-50 rounded-full" />
              <div className="relative bg-gradient-to-r from-primary to-rose text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                -{discount}%
              </div>
            </div>
          </div>
        )}

        {/* Custom Badge */}
        {badge && discount === 0 && (
          <div className="absolute top-3 right-3 bg-secondary/95 backdrop-blur-sm text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-md z-20">
            {badge}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm
              transform translate-x-[-60px] group-hover:translate-x-0
              ${inWishlist 
                ? 'bg-primary text-primary-foreground scale-110' 
                : 'bg-white/90 hover:bg-primary hover:text-primary-foreground hover:scale-110'
              }`}
            style={{ transitionDelay: '0ms' }}
          >
            <Heart className={`w-5 h-5 transition-transform duration-300 ${inWishlist ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleViewProduct(); }}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg
              transform translate-x-[-60px] group-hover:translate-x-0 hover:scale-110"
            style={{ transitionDelay: '50ms' }}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} z-20`}>
          <button
            onClick={handleCartClick}
            className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-foreground flex items-center justify-center shadow-xl 
              hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-white/50
              transform translate-y-[60px] group-hover:translate-y-0 hover:scale-110 hover:rotate-12"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 relative z-10">
        {/* Rating with glow */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 transition-colors ${
                  star <= Math.floor(rating) 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'fill-muted text-muted'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">({rating})</span>
        </div>

        {/* Name with hover effect */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 min-h-[2.5rem] leading-snug
          group-hover:text-primary transition-colors duration-300">
          {isRTL ? (nameAr || name) : name}
        </h3>

        {/* Price with animation */}
        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <span className="text-lg font-bold text-primary group-hover:scale-105 transition-transform origin-right">
            {price.toFixed(0)} <span className="text-sm">{t('egp')}</span>
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
              {originalPrice.toFixed(0)} {t('egp')}
            </span>
          )}
        </div>

        {/* Colors with pop animation */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            {colors.slice(0, 5).map((color, idx) => (
              <button
                key={color.hex}
                onClick={(e) => handleColorSelect(e, color)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-125 hover:shadow-lg ${
                  selectedColor?.hex === color.hex 
                    ? 'border-primary ring-2 ring-primary/30 scale-110 shadow-md' 
                    : 'border-white shadow-sm'
                }`}
                style={{ 
                  backgroundColor: color.hex,
                  transitionDelay: `${idx * 30}ms`
                }}
                title={isRTL ? color.name_ar : color.name}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                +{colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Sizes with selection animation */}
        {sizes && sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {sizes.map((size, idx) => (
              <button
                key={size}
                onClick={(e) => handleSizeSelect(e, size)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all duration-300 hover:scale-105 ${
                  selectedSize === size 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
                    : 'bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-muted'
                }`}
                style={{ transitionDelay: `${idx * 20}ms` }}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Loyalty Points with sparkle */}
        {loyaltyPoints && loyaltyPoints > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-foreground bg-gradient-to-r from-accent/60 to-accent/40 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-primary" />
            +{loyaltyPoints} {t('points')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
