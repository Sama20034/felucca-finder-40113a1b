import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const ProductsShowcase = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const products = [
    {
      id: 1,
      nameEn: "Golden Repair Serum",
      nameAr: "سيروم الإصلاح الذهبي",
      price: 450,
      originalPrice: 599,
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=500&fit=crop",
      badge: isRTL ? "الأكثر مبيعاً" : "Best Seller"
    },
    {
      id: 2,
      nameEn: "Royal Hair Oil",
      nameAr: "زيت الشعر الملكي",
      price: 380,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=500&fit=crop",
      badge: null
    },
    {
      id: 3,
      nameEn: "Gold Mask Treatment",
      nameAr: "ماسك العلاج الذهبي",
      price: 520,
      originalPrice: 650,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
      badge: isRTL ? "جديد" : "New"
    },
    {
      id: 4,
      nameEn: "Shine Boost Spray",
      nameAr: "سبراي تعزيز اللمعان",
      price: 280,
      originalPrice: null,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop",
      badge: null
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-wider uppercase mb-4">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              {isRTL ? 'منتجاتنا' : 'Our Products'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
              {isRTL ? 'تشكيلة فاخرة' : 'Luxury Collection'}
            </h2>
          </div>
          <Button 
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8"
            onClick={() => navigate('/shop')}
          >
            {isRTL ? 'عرض الكل' : 'View All'}
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group card-luxury overflow-hidden hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.image}
                  alt={isRTL ? product.nameAr : product.nameEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                    {product.badge}
                  </span>
                )}

                {/* Quick Add */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <Button className="w-full btn-gold rounded-full" onClick={() => navigate(`/product/${product.id}`)}>
                    <ShoppingBag className="w-4 h-4 ml-2" />
                    {isRTL ? 'أضيفي للسلة' : 'Add to Cart'}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm text-primary font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {isRTL ? product.nameAr : product.nameEn}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">{product.price} {isRTL ? 'ج.م' : 'EGP'}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;