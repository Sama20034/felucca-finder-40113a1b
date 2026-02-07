import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, viewportOnce } from '@/hooks/useAnimations';
import { useRef, useState } from 'react';

// Import testimonial screenshots
import review1 from '@/assets/testimonials/review-1.png';
import review2 from '@/assets/testimonials/review-2.png';
import review3 from '@/assets/testimonials/review-3.png';
import review4 from '@/assets/testimonials/review-4.png';
import review5 from '@/assets/testimonials/review-5.png';
import review6 from '@/assets/testimonials/review-6.png';
import review7 from '@/assets/testimonials/review-7.png';
import review8 from '@/assets/testimonials/review-8.png';
import review9 from '@/assets/testimonials/review-9.png';
import review10 from '@/assets/testimonials/review-10.jpg';
import review11 from '@/assets/testimonials/review-11.png';
import review12 from '@/assets/testimonials/review-12.png';
import review13 from '@/assets/testimonials/review-13.png';

const testimonialImages = [
  review1, review2, review3, review4, review5, 
  review6, review7, review8, review9, review10,
  review11, review12, review13
];

const BeautyTestimonials = () => {
  const { isRTL } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
          >
            {isRTL ? 'ماذا تقول عميلاتنا' : 'What Our Customers Say'}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ delay: 0.2 }}
          >
            {isRTL ? 'تجارب حقيقية من عميلات سعيدات' : 'Real experiences from happy customers'}
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg transition-opacity ${
              canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg transition-opacity ${
              canScrollRight ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </motion.button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-12 md:px-16 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonialImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex-shrink-0 snap-center"
              >
                <div className="w-[280px] sm:w-[320px] md:w-[380px] bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={image}
                    alt={`Customer review ${index + 1}`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonialImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = 320 + 24; // card width + gap
                    scrollContainerRef.current.scrollTo({
                      left: index * cardWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="w-2 h-2 rounded-full bg-primary/30 hover:bg-primary transition-colors"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeautyTestimonials;
