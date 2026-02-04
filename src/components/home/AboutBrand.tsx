import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import aboutImage from '@/assets/benefits-model.png';
import { fadeInUp, imageReveal, staggerContainer, staggerItem, viewportOnce } from '@/hooks/useAnimations';

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
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? '' : ''}`}>
          {/* Image */}
          <motion.div
            variants={imageReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className={isRTL ? 'lg:order-2' : ''}
          >
            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <motion.img 
                src={aboutImage} 
                alt={isRTL ? 'قصتنا' : 'Our Story'}
                className="w-full h-[400px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className={`space-y-6 ${isRTL ? 'text-right lg:order-1' : 'text-left'}`}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-foreground"
            >
              {content.title}
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {content.description}
            </motion.p>

            {/* Features List */}
            <motion.ul 
              variants={staggerContainer}
              className="space-y-3"
            >
              {content.features.map((feature, index) => (
                <motion.li
                  key={index}
                  variants={staggerItem}
                  whileHover={{ x: isRTL ? -10 : 10 }}
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  </motion.div>
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={staggerItem}>
              <Link to="/about">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" className="btn-beauty mt-4">
                    {content.cta}
                    {isRTL ? (
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrand;
