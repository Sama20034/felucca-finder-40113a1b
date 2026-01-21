import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Gem, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const CategoriesShowcase = () => {
  const { isRTL } = useLanguage();

  const categories = [
    {
      id: 'oils',
      icon: Droplet,
      title: isRTL ? 'زيوت الشعر' : 'Hair Oils',
      description: isRTL 
        ? 'زيوت طبيعية لتغذية وترطيب الشعر'
        : 'Natural oils for hair nourishment',
      image: '/assets/products/product-1.jpg',
    },
    {
      id: 'accessories',
      icon: Gem,
      title: isRTL ? 'إكسسوارات' : 'Accessories',
      description: isRTL 
        ? 'إكسسوارات أنيقة تحمي شعرك'
        : 'Elegant accessories that protect your hair',
      image: '/assets/products/product-3.jpg',
    },
    {
      id: 'care',
      icon: Sparkles,
      title: isRTL ? 'العناية المتكاملة' : 'Complete Care',
      description: isRTL 
        ? 'روتين متكامل للعناية بالشعر'
        : 'Complete hair care routine',
      image: '/assets/products/product-5.jpg',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header - Simple & Direct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            {isRTL ? 'تصفحي منتجاتنا' : 'Browse Our Products'}
          </h2>
          <p className="text-muted-foreground text-lg">
            {isRTL ? 'اختاري الفئة المناسبة لاحتياجاتك' : 'Choose the category that fits your needs'}
          </p>
        </motion.div>

        {/* Categories Grid - Clean Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?category=${category.id}`}
                  className="group block"
                >
                  <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      
                      {/* Icon */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-primary/90 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                        {isRTL ? 'تصفحي الآن' : 'Browse Now'}
                        {isRTL ? (
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link to="/shop">
            <Button size="lg" variant="outline" className="btn-outline-beauty">
              {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
              {isRTL ? (
                <ArrowLeft className="w-4 h-4 mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;
