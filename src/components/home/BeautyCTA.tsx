import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            {content.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8">
            {content.description}
          </p>

          {/* CTA */}
          <Link to="/shop">
            <Button size="lg" className="btn-beauty text-base px-10 py-6 shadow-lg shadow-primary/20 group">
              <ShoppingBag className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
    </section>
  );
};

export default BeautyCTA;
