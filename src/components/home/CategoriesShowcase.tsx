import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Gem, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CategoriesShowcase = () => {
  const { isRTL } = useLanguage();

  const categories = [
    {
      id: 'oils',
      icon: Droplet,
      title: isRTL ? 'زيوت الشعر' : 'Hair Oils',
      description: isRTL 
        ? 'زيوت طبيعية 100% لتغذية وترطيب الشعر من الجذور حتى الأطراف'
        : '100% natural oils to nourish and hydrate hair from roots to tips',
      color: 'from-amber-100 to-orange-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      id: 'accessories',
      icon: Gem,
      title: isRTL ? 'إكسسوارات الشعر' : 'Hair Accessories',
      description: isRTL 
        ? 'إكسسوارات أنيقة وعملية تحمي شعرك وتضيف لمسة جمالية'
        : 'Elegant and practical accessories that protect your hair and add beauty',
      color: 'from-rose-100 to-pink-50',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
    {
      id: 'care',
      icon: Sparkles,
      title: isRTL ? 'العناية المتكاملة' : 'Complete Care',
      description: isRTL 
        ? 'روتين متكامل للعناية بالشعر يجمع بين الطبيعة والتكنولوجيا'
        : 'Complete hair care routine combining nature and technology',
      color: 'from-violet-100 to-purple-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">
            {isRTL ? 'منتجاتنا' : 'Our Products'}
          </span>
          <h2 className="heading-section text-foreground mb-4">
            {isRTL ? 'اكتشفي مجموعتنا' : 'Discover Our Collection'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'مجموعة متكاملة من منتجات العناية بالشعر المصممة خصيصاً لتلبية احتياجاتك'
              : 'A complete collection of hair care products specially designed for your needs'}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link
                  to={`/shop?category=${category.id}`}
                  className="group block"
                >
                  <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${category.color} border border-border/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${category.iconColor}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {category.description}
                    </p>

                    {/* Link */}
                    <span className="inline-flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                      {isRTL ? 'تصفحي المنتجات' : 'Browse Products'}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;