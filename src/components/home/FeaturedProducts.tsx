import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const products = [
  {
    id: 'oil-1',
    name: 'Golden Argan Elixir',
    name_ar: 'إكسير الأرجان الذهبي',
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviews: 128,
    image: '/assets/products/product-1.jpg',
    badge: { en: 'Best Seller', ar: 'الأكثر مبيعاً' },
  },
  {
    id: 'oil-2',
    name: 'Royal Castor Oil',
    name_ar: 'زيت الخروع الملكي',
    price: 320,
    originalPrice: 400,
    rating: 4.8,
    reviews: 95,
    image: '/assets/products/product-2.jpg',
    badge: { en: 'Popular', ar: 'شائع' },
  },
  {
    id: 'oil-3',
    name: 'Coconut Gold Serum',
    name_ar: 'سيروم جوز الهند الذهبي',
    price: 580,
    originalPrice: null,
    rating: 5.0,
    reviews: 67,
    image: '/assets/products/product-3.jpg',
    badge: { en: 'New', ar: 'جديد' },
  },
  {
    id: 'oil-4',
    name: 'Rosemary Growth Oil',
    name_ar: 'زيت الروزماري للنمو',
    price: 380,
    originalPrice: 450,
    rating: 4.7,
    reviews: 156,
    image: '/assets/products/product-4.jpg',
    badge: null,
  },
];

const FeaturedProducts = () => {
  const { isRTL } = useLanguage();
  const { addToCart } = useCart();

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-primary font-medium mb-4 block">
              {isRTL ? 'الأكثر مبيعاً' : 'Best Sellers'}
            </span>
            <h2 className="heading-section text-foreground">
              {isRTL ? 'منتجات مميزة' : 'Featured Products'}
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="outline" className="btn-outline-beauty group">
              {isRTL ? 'عرض الكل' : 'View All'}
              {isRTL ? (
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  <img
                    src={product.image}
                    alt={isRTL ? product.name_ar : product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {isRTL ? product.badge.ar : product.badge.en}
                    </div>
                  )}

                  {/* Quick Add */}
                  <button
                    onClick={() => addToCart(product.id, 1)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-background rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-serif font-semibold text-foreground mb-3 line-clamp-1">
                    {isRTL ? product.name_ar : product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price} {isRTL ? 'ج.م' : 'EGP'}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice} {isRTL ? 'ج.م' : 'EGP'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;