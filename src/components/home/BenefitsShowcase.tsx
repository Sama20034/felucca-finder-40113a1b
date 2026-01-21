import { motion } from 'framer-motion';
import { Leaf, Shield, Heart, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BenefitsShowcase = () => {
  const { isRTL } = useLanguage();

  const benefits = [
    {
      icon: Leaf,
      title: isRTL ? 'مكونات طبيعية' : 'Natural Ingredients',
      description: isRTL 
        ? 'نستخدم فقط أجود المكونات الطبيعية والعضوية في منتجاتنا'
        : 'We use only the finest natural and organic ingredients in our products',
    },
    {
      icon: Shield,
      title: isRTL ? 'آمنة ومختبرة' : 'Safe & Tested',
      description: isRTL 
        ? 'جميع منتجاتنا مختبرة معملياً وآمنة للاستخدام اليومي'
        : 'All our products are lab-tested and safe for daily use',
    },
    {
      icon: Heart,
      title: isRTL ? 'نتائج مضمونة' : 'Guaranteed Results',
      description: isRTL 
        ? 'نضمن لك نتائج ملحوظة خلال أسابيع قليلة من الاستخدام المنتظم'
        : 'We guarantee noticeable results within weeks of regular use',
    },
    {
      icon: Award,
      title: isRTL ? 'جودة فائقة' : 'Premium Quality',
      description: isRTL 
        ? 'معايير جودة عالية في كل مرحلة من مراحل الإنتاج'
        : 'High quality standards at every stage of production',
    },
  ];

  return (
    <section className="section-padding bg-secondary/20">
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
            {isRTL ? 'لماذا نحن؟' : 'Why Choose Us?'}
          </span>
          <h2 className="heading-section text-foreground mb-4">
            {isRTL ? 'ما يميزنا' : 'What Makes Us Different'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'نؤمن بأن الجمال الحقيقي يأتي من العناية الصحيحة بمكونات نقية وفعالة'
              : 'We believe true beauty comes from proper care with pure and effective ingredients'}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-background rounded-2xl shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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