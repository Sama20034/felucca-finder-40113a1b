import { motion } from 'framer-motion';
import { Leaf, Shield, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BenefitsShowcase = () => {
  const { isRTL } = useLanguage();

  const benefits = [
    {
      icon: Leaf,
      title: isRTL ? 'طبيعي 100%' : '100% Natural',
      description: isRTL ? 'مكونات طبيعية وآمنة' : 'Natural & safe ingredients',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Shield,
      title: isRTL ? 'مختبر معملياً' : 'Lab Tested',
      description: isRTL ? 'جودة مضمونة' : 'Quality guaranteed',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Sparkles,
      title: isRTL ? 'نتائج سريعة' : 'Fast Results',
      description: isRTL ? 'خلال 4 أسابيع' : 'Within 4 weeks',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Heart,
      title: isRTL ? '+5000 عميلة' : '5000+ Customers',
      description: isRTL ? 'راضيات عن منتجاتنا' : 'Happy with our products',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <section className="py-16 bg-background border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${benefit.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsShowcase;
