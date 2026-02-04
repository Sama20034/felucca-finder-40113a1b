import { motion } from 'framer-motion';
import { Leaf, Shield, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { staggerContainer, staggerItem, scaleInBounce, viewportOnce } from '@/hooks/useAnimations';

const BenefitsShowcase = () => {
  const { isRTL } = useLanguage();

  const benefits = [
    {
      icon: Leaf,
      title: isRTL ? 'طبيعي 100%' : '100% Natural',
      description: isRTL ? 'مكونات طبيعية وآمنة' : 'Natural & safe ingredients',
      color: 'bg-green-50 text-green-600',
      hoverColor: 'group-hover:bg-green-100',
    },
    {
      icon: Shield,
      title: isRTL ? 'مختبر معملياً' : 'Lab Tested',
      description: isRTL ? 'جودة مضمونة' : 'Quality guaranteed',
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'group-hover:bg-blue-100',
    },
    {
      icon: Sparkles,
      title: isRTL ? 'نتائج سريعة' : 'Fast Results',
      description: isRTL ? 'خلال 4 أسابيع' : 'Within 4 weeks',
      color: 'bg-amber-50 text-amber-600',
      hoverColor: 'group-hover:bg-amber-100',
    },
    {
      icon: Heart,
      title: isRTL ? '+5000 عميلة' : '5000+ Customers',
      description: isRTL ? 'راضيات عن منتجاتنا' : 'Happy with our products',
      color: 'bg-rose-50 text-rose-600',
      hoverColor: 'group-hover:bg-rose-100',
    },
  ];

  return (
    <section className="py-16 bg-background border-y border-border/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={scaleInBounce}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center group cursor-pointer"
              >
                <motion.div 
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${benefit.color} ${benefit.hoverColor} transition-colors duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsShowcase;
