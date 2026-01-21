import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const BeautyCTA = () => {
  const { isRTL } = useLanguage();

  const content = {
    title: isRTL ? 'ابدئي رحلة جمال شعرك اليوم' : 'Start Your Hair Beauty Journey Today',
    description: isRTL 
      ? 'احصلي على خصم 15% على طلبك الأول عند الاشتراك في نشرتنا البريدية'
      : 'Get 15% off your first order when you subscribe to our newsletter',
    cta: isRTL ? 'تسوقي الآن' : 'Shop Now',
    secondary: isRTL ? 'شاهدي النتائج' : 'See Results',
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>

          {/* Title */}
          <h2 className="heading-section text-foreground mb-6">
            {content.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {content.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="btn-beauty text-base group">
                {content.cta}
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="btn-outline-beauty text-base">
                {content.secondary}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeautyCTA;