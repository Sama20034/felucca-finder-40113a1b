import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { staggerContainer, staggerItem, fadeInUp, viewportOnce } from '@/hooks/useAnimations';

const testimonials = [
  {
    id: 1,
    name: { en: 'Sarah Ahmed', ar: 'سارة أحمد' },
    text: {
      en: 'After 3 weeks, my hair is noticeably softer and shinier!',
      ar: 'بعد 3 أسابيع، شعري أصبح أنعم ولامع بشكل ملحوظ!',
    },
    rating: 5,
  },
  {
    id: 2,
    name: { en: 'Nour Mohamed', ar: 'نور محمد' },
    text: {
      en: 'The Rosemary Growth Oil is amazing! I noticed new hair growth.',
      ar: 'زيت الروزماري للنمو رائع! لاحظت نمو شعر جديد.',
    },
    rating: 5,
  },
  {
    id: 3,
    name: { en: 'Maha Ali', ar: 'مها علي' },
    text: {
      en: 'Best hair care products I have ever used. Natural and effective!',
      ar: 'أفضل منتجات عناية بالشعر استخدمتها. طبيعية وفعالة!',
    },
    rating: 5,
  },
];

const BeautyTestimonials = () => {
  const { isRTL } = useLanguage();

  return (
    <section className="py-20 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
          >
            {isRTL ? 'ماذا تقول عميلاتنا' : 'What Our Customers Say'}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ delay: 0.2 }}
          >
            {isRTL ? 'تجارب حقيقية من عميلات سعيدات' : 'Real experiences from happy customers'}
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card rounded-2xl p-6 border border-border/50 transition-all duration-300 cursor-pointer"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Rating with stagger */}
              <motion.div 
                className="flex gap-1 mb-4"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Text */}
              <motion.p 
                className="text-foreground leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ delay: 0.4 }}
              >
                "{isRTL ? testimonial.text.ar : testimonial.text.en}"
              </motion.p>

              {/* Author */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {testimonial.name.en[0]}
                </motion.div>
                <div className="font-medium text-foreground text-sm">
                  {isRTL ? testimonial.name.ar : testimonial.name.en}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BeautyTestimonials;
