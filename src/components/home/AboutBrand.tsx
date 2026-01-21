import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import aboutImage from '@/assets/about-beauty.jpg';

const AboutBrand = () => {
  const { isRTL } = useLanguage();

  const content = {
    title: isRTL ? 'لماذا Reselience Gold؟' : 'Why Reselience Gold?',
    description: isRTL 
      ? 'نؤمن بأن كل امرأة تستحق شعراً صحياً ولامعاً. منتجاتنا مصنوعة بعناية من أجود المكونات الطبيعية لتمنحك نتائج حقيقية.'
      : 'We believe every woman deserves healthy, shiny hair. Our products are carefully crafted from the finest natural ingredients to give you real results.',
    features: [
      isRTL ? 'مكونات طبيعية 100%' : '100% natural ingredients',
      isRTL ? 'بدون كيماويات ضارة' : 'No harmful chemicals',
      isRTL ? 'نتائج مضمونة ومثبتة' : 'Guaranteed proven results',
      isRTL ? 'شحن سريع لجميع أنحاء مصر' : 'Fast shipping across Egypt',
    ],
    cta: isRTL ? 'اعرفي أكتر' : 'Learn More',
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? '' : ''}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={isRTL ? 'lg:order-2' : ''}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img 
                src={aboutImage} 
                alt={isRTL ? 'قصتنا' : 'Our Story'}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`space-y-6 ${isRTL ? 'text-right lg:order-1' : 'text-left'}`}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {content.title}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content.description}
            </p>

            {/* Features List */}
            <ul className="space-y-3">
              {content.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link to="/about">
              <Button size="lg" className="btn-beauty mt-4">
                {content.cta}
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4 mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2" />
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
