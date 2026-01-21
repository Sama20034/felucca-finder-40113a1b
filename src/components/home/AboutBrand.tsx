import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import aboutImage from '@/assets/about-beauty.jpg';

const AboutBrand = () => {
  const { isRTL } = useLanguage();

  const content = {
    subtitle: isRTL ? 'قصتنا' : 'Our Story',
    title: isRTL ? 'جمال طبيعي، نتائج حقيقية' : 'Natural Beauty, Real Results',
    description: isRTL 
      ? 'في Reselience Gold، نؤمن بأن كل امرأة تستحق شعراً صحياً ولامعاً. منتجاتنا مصنوعة بعناية من أجود المكونات الطبيعية لتحقيق نتائج ملموسة.'
      : 'At Reselience Gold, we believe every woman deserves healthy, shiny hair. Our products are carefully crafted from the finest natural ingredients for tangible results.',
    features: isRTL 
      ? ['مكونات طبيعية 100%', 'خالية من المواد الضارة', 'نتائج مثبتة علمياً', 'مناسبة لجميع أنواع الشعر']
      : ['100% Natural Ingredients', 'Free from Harmful Chemicals', 'Scientifically Proven Results', 'Suitable for All Hair Types'],
    cta: isRTL ? 'اعرفي المزيد عنا' : 'Learn More About Us',
  };

  return (
    <section className="section-padding bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={aboutImage}
                  alt="About Reselience Gold"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-3xl -z-10" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium mb-4 block">
              {content.subtitle}
            </span>
            <h2 className="heading-section text-foreground mb-6">
              {content.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {content.description}
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-10">
              {content.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link to="/about">
              <Button size="lg" className="btn-beauty group">
                {content.cta}
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrand;