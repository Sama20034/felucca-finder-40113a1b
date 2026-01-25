import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/reselience-gold-logo.png';
import heroImage from '@/assets/hero-beauty.jpg';
const BeautyHero = () => {
  const {
    isRTL
  } = useLanguage();
  const content = {
    tagline: isRTL ? 'منتجات طبيعية 100%' : '100% Natural Products',
    headline: isRTL ? 'شعر صحي ولامع يبدأ هنا' : 'Healthy & Shiny Hair Starts Here',
    subheadline: isRTL ? 'زيوت طبيعية ومنتجات عناية بالشعر لنتائج مضمونة خلال أسابيع' : 'Natural oils & hair care products for guaranteed results within weeks',
    cta: isRTL ? 'تسوقي الآن' : 'Shop Now',
    secondary: isRTL ? 'شاهدي النتائج' : 'See Results'
  };
  return <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-secondary/30 via-background to-background overflow-hidden pt-24">
      {/* Soft decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-8 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content Side */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className={`space-y-6 sm:space-y-8 ${isRTL ? 'text-center sm:text-right lg:order-2' : 'text-center sm:text-left'}`}>
            {/* Logo - Prominent */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }} className="mb-8">
              
            </motion.div>

            {/* Tagline */}
            <motion.span initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="inline-block text-xs sm:text-sm font-medium text-primary bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              {content.tagline}
            </motion.span>

            {/* Headline - Clear & Direct */}
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight px-2 sm:px-0">
              {content.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} className={`text-sm sm:text-lg md:text-xl text-muted-foreground max-w-lg px-4 sm:px-0 ${isRTL ? 'mx-auto sm:mr-0 sm:ml-auto' : 'mx-auto sm:ml-0 sm:mr-auto'}`}>
              {content.subheadline}
            </motion.p>

            {/* CTAs - Clear Funnel */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.5
          }} className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${isRTL ? 'items-end sm:justify-end' : 'items-start sm:justify-start'}`}>
              <Link to="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="btn-beauty text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 group shadow-lg shadow-primary/20 w-full sm:w-auto">
                  <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {content.cta}
                  {isRTL ? <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </Link>
              <Link to="/results" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="btn-outline-beauty text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto">
                  {content.secondary}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators - Simple */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }} className={`flex items-center justify-center gap-4 sm:gap-8 pt-6 w-full ${isRTL ? 'flex-row-reverse sm:justify-start' : 'sm:justify-start'}`}>
              <div className="text-center flex-1 sm:flex-none">
                <div className="text-lg sm:text-2xl font-bold text-primary">+5000</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{isRTL ? 'عميلة سعيدة' : 'Happy Customers'}</div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-border" />
              <div className="text-center flex-1 sm:flex-none">
                <div className="text-lg sm:text-2xl font-bold text-primary">100%</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{isRTL ? 'طبيعي' : 'Natural'}</div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-border" />
              <div className="text-center flex-1 sm:flex-none">
                <div className="text-lg sm:text-2xl font-bold text-primary">4.9⭐</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{isRTL ? 'تقييم' : 'Rating'}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className={`relative ${isRTL ? 'lg:order-1' : ''}`}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
                <img src={heroImage} alt={isRTL ? 'منتجات العناية بالشعر' : 'Hair Care Products'} className="w-full h-[500px] md:h-[600px] object-cover" />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
              </div>

              {/* Floating Badge */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.8
            }} className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background rounded-2xl p-4 shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
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
    </section>;
};
export default BeautyHero;