import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, scaleInBounce, viewportOnce } from '@/hooks/useAnimations';

const BeautyCTA = () => {
  const { isRTL } = useLanguage();

  const content = {
    title: isRTL ? 'ابدئي رحلة جمال شعرك اليوم' : 'Start Your Hair Beauty Journey Today',
    description: isRTL 
      ? 'احصلي على شعر صحي ولامع مع منتجاتنا الطبيعية'
      : 'Get healthy, shiny hair with our natural products',
    cta: isRTL ? 'تسوقي الآن' : 'Shop Now',
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [0, -50],
              rotate: [0, 180]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut'
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${60 + Math.random() * 20}%`
            }}
          >
            <Sparkles className="w-4 h-4 text-primary/30" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <motion.h2 
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
          >
            {content.title}
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ delay: 0.2 }}
          >
            {content.description}
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={scaleInBounce}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Link to="/shop">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" className="btn-beauty text-base px-10 py-6 shadow-lg shadow-primary/20 group">
                  <ShoppingBag className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {content.cta}
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform duration-300" />
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  )}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeautyCTA;
