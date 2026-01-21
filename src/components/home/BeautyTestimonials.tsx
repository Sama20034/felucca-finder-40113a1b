import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  {
    id: 1,
    name: { en: 'Sarah Ahmed', ar: 'سارة أحمد' },
    role: { en: 'Verified Buyer', ar: 'مشترية موثقة' },
    text: {
      en: 'After using Golden Argan Elixir for 3 weeks, my hair has become noticeably softer and shinier. Absolutely love it!',
      ar: 'بعد استخدام إكسير الأرجان الذهبي لمدة 3 أسابيع، أصبح شعري أنعم ولامعاً بشكل ملحوظ. أحبه جداً!',
    },
    rating: 5,
    avatar: 'S',
  },
  {
    id: 2,
    name: { en: 'Nour Mohamed', ar: 'نور محمد' },
    role: { en: 'Verified Buyer', ar: 'مشترية موثقة' },
    text: {
      en: 'The Rosemary Growth Oil is amazing! I noticed new hair growth within just 4 weeks. Highly recommend!',
      ar: 'زيت الروزماري للنمو رائع! لاحظت نمو شعر جديد خلال 4 أسابيع فقط. أنصح به بشدة!',
    },
    rating: 5,
    avatar: 'N',
  },
  {
    id: 3,
    name: { en: 'Maha Ali', ar: 'مها علي' },
    role: { en: 'Verified Buyer', ar: 'مشترية موثقة' },
    text: {
      en: 'Best hair care products I have ever used. Natural ingredients and amazing results. Thank you Reselience Gold!',
      ar: 'أفضل منتجات عناية بالشعر استخدمتها على الإطلاق. مكونات طبيعية ونتائج مذهلة. شكراً Reselience Gold!',
    },
    rating: 5,
    avatar: 'M',
  },
];

const BeautyTestimonials = () => {
  const { isRTL } = useLanguage();

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
            {isRTL ? 'آراء العملاء' : 'Customer Reviews'}
          </span>
          <h2 className="heading-section text-foreground mb-4">
            {isRTL ? 'ماذا تقول عميلاتنا' : 'What Our Customers Say'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشفي تجارب حقيقية من عميلات سعيدات بمنتجاتنا'
              : 'Discover real experiences from customers happy with our products'}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6">
                "{isRTL ? testimonial.text.ar : testimonial.text.en}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {isRTL ? testimonial.name.ar : testimonial.name.en}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? testimonial.role.ar : testimonial.role.en}
                  </div>
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