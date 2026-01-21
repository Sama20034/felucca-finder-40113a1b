import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            {isRTL ? 'ماذا تقول عميلاتنا' : 'What Our Customers Say'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'تجارب حقيقية من عميلات سعيدات' : 'Real experiences from happy customers'}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-4">
                "{isRTL ? testimonial.text.ar : testimonial.text.en}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.name.en[0]}
                </div>
                <div className="font-medium text-foreground text-sm">
                  {isRTL ? testimonial.name.ar : testimonial.name.en}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeautyTestimonials;
