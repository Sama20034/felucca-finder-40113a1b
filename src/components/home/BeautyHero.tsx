import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-products.png';
import { useRef, useState } from 'react';
import { 
  fadeInUp, 
  staggerContainer, 
  staggerItem, 
  scaleInBounce,
  imageReveal,
  viewportOnce 
} from '@/hooks/useAnimations';
import { Skeleton } from '@/components/ui/skeleton';

const BeautyHero = () => {
  const { isRTL } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const content = {
    tagline: isRTL ? 'منتجات طبيعية 100%' : '100% Natural Products',
    headline: isRTL ? 'شعر صحي ولامع يبدأ هنا' : 'Healthy & Shiny Hair Starts Here',
    subheadline: isRTL ? 'زيوت ومنتجات عناية بالشعر لنتائج مضمونة خلال أسابيع' : 'Oils & hair care products for guaranteed results within weeks',
    cta: isRTL ? 'تسوقي الآن' : 'Shop Now',
    secondary: isRTL ? 'شاهدي النتائج' : 'See Results'
  };

  // Text reveal animation for headline
  const headlineWords = content.headline.split(' ');

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-secondary/30 via-background to-background overflow-hidden pt-8 sm:pt-4 lg:pt-0"
    >
      {/* Animated decorative elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" 
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [-20, -100],
              x: [0, Math.random() * 40 - 20]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut'
            }}
            style={{
              left: `${10 + i * 12}%`,
              bottom: '10%'
            }}
          >
            <Sparkles className="w-4 h-4 text-primary/40" />
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-8 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content Side */}
          <motion.div 
            style={{ y, opacity }}
            className={`space-y-6 sm:space-y-8 ${isRTL ? 'text-center sm:text-right lg:order-2' : 'text-center sm:text-left'}`}
          >

            {/* Headline with word-by-word animation */}
            <motion.h1 
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight px-2 sm:px-0"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {headlineWords.map((word, index) => (
                <motion.span 
                  key={index} 
                  variants={staggerItem}
                  className="inline-block mx-1"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className={`text-sm sm:text-lg md:text-xl text-muted-foreground max-w-lg px-4 sm:px-0 ${isRTL ? 'mx-auto sm:mr-0 sm:ml-auto' : 'mx-auto sm:ml-0 sm:mr-auto'}`}
            >
              {content.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 w-full ${isRTL ? 'items-start sm:items-center sm:justify-start' : 'items-start sm:justify-start'}`}
            >
              <motion.div variants={staggerItem}>
                <Link to="/shop" className="w-full sm:w-auto block">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="btn-beauty text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 group shadow-lg shadow-primary/20 w-full sm:w-auto">
                      <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {content.cta}
                      {isRTL ? (
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
            </motion.div>

            {/* Trust Indicators with stagger */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`flex items-center gap-4 sm:gap-8 pt-6 w-full ${isRTL ? 'justify-start' : 'justify-start'}`}
            >
              {[
                { value: '+5000', label: isRTL ? 'عميلة سعيدة' : 'Happy Customers' },
                { value: '4.9⭐', label: isRTL ? 'تقييم' : 'Rating' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={scaleInBounce}
                  className="text-center flex-1 sm:flex-none"
                >
                  <motion.div 
                    className="text-lg sm:text-2xl font-bold text-primary"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.8 + index * 0.1,
                      type: 'spring',
                      stiffness: 200
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            variants={imageReveal}
            initial="hidden"
            animate="visible"
            className={`relative ${isRTL ? 'lg:order-1' : ''}`}
          >
            <div className="relative">
              {/* Main Image with hover effect */}
              <motion.div 
                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Skeleton placeholder */}
                {!imageLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-[500px] md:h-[600px]" />
                )}
                <motion.img 
                  src={heroImage} 
                  alt={isRTL ? 'منتجات العناية بالشعر' : 'Hair Care Products'} 
                  className={`w-full h-[500px] md:h-[600px] object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                {/* Animated overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </motion.div>

              {/* Floating Badge with bounce animation */}
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background rounded-2xl px-5 py-4 shadow-xl border border-border cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <span className="text-xl">✨</span>
                  </motion.div>
                  <div className="pr-2">
                    <div className="font-semibold text-foreground text-sm">
                      {isRTL ? 'نتائج مضمونة' : 'Guaranteed Results'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? 'خلال 4 أسابيع' : 'Within 4 weeks'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeautyHero;
