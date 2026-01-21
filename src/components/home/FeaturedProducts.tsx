import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const products = [
  {
    id: 1,
    name: 'Golden Argan Elixir',
    nameAr: 'إكسير الأرجان الذهبي',
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviews: 128,
    image: '/assets/products/product-1.jpg',
    badge: { en: 'Best Seller', ar: 'الأكثر مبيعاً' },
  },
  {
    id: 2,
    name: 'Rosemary Growth Oil',
    nameAr: 'زيت الروزماري للنمو',
    price: 380,
    originalPrice: null,
    rating: 4.8,
    reviews: 95,
    image: '/assets/products/product-2.jpg',
    badge: null,
  },
  {
    id: 3,
    name: 'Silk Hair Scrunchie Set',
    nameAr: 'مجموعة ربطات الحرير',
    price: 220,
    originalPrice: 280,
    rating: 4.7,
    reviews: 67,
    image: '/assets/products/product-3.jpg',
    badge: { en: '-20%', ar: '-20%' },
  },
  {
    id: 4,
    name: 'Castor Strengthening Oil',
    nameAr: 'زيت الخروع المقوي',
    price: 320,
    originalPrice: null,
    rating: 4.9,
    reviews: 156,
    image: '/assets/products/product-4.jpg',
    badge: { en: 'New', ar: 'جديد' },
  },
];

const FeaturedProducts = () => {
  const { isRTL } = useLanguage();
  const { addToCart } = useCart();

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
              {isRTL ? 'الأكثر مبيعاً والمحبوبة من عملائنا' : 'Best sellers loved by our customers'}
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
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <Link to={`/product/${product.id}`} className="block relative">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={isRTL ? product.nameAr : product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        {isRTL ? product.badge.ar : product.badge.en}
                      </div>
                    )}

                    {/* Quick Add Button - Visible on hover */}
                    <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product.id, 1);
                        }}
                        size="sm" 
                        className="btn-beauty shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Name */}
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 mb-2">
                      {isRTL ? product.nameAr : product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price} {isRTL ? 'ج.م' : 'EGP'}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
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
