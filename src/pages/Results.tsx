import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import BeforeAfterSlider from "@/components/home/BeforeAfterSlider";
import { staggerContainer, staggerItem, fadeInUp, viewportOnce } from "@/hooks/useAnimations";

import zBefore from "@/assets/results/z-before.jpeg";
import zAfter from "@/assets/results/z-after.jpeg";
import cBefore from "@/assets/results/c-before.jpg";
import cAfter from "@/assets/results/c-after.jpg";
import fBefore from "@/assets/results/f-before.jpeg";
import fAfter from "@/assets/results/f-after.jpeg";
import sBefore from "@/assets/results/s-before.jpeg";
import sAfter from "@/assets/results/s-after.jpeg";
import xBefore from "@/assets/results/x-before.jpeg";
import xAfter from "@/assets/results/x-after.jpeg";

const Results = () => {
  const { t, isRTL } = useLanguage();

  const sliderResults = [
    { id: 1, before: zBefore, after: zAfter },
    { id: 2, before: cBefore, after: cAfter },
    { id: 3, before: fBefore, after: fAfter },
    { id: 4, before: sBefore, after: sAfter },
    { id: 5, before: xBefore, after: xAfter },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t('realResults')}
              </span>
            </div>
            
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              {t('transformationJourney')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('resultsDescription')}
            </p>
          </motion.div>

          {/* Interactive Before/After Sliders */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mb-20"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-playfair font-bold text-center text-foreground mb-8"
            >
              {isRTL ? 'اسحب لرؤية الفرق' : 'Slide to See the Difference'}
            </motion.h2>
            
            {/* First row - 3 sliders */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-6">
              {sliderResults.slice(0, 3).map((result) => (
                <motion.div key={result.id} variants={staggerItem}>
                  <BeforeAfterSlider
                    beforeImage={result.before}
                    afterImage={result.after}
                    beforeLabel={isRTL ? "قبل" : "Before"}
                    afterLabel={isRTL ? "بعد" : "After"}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Second row - 2 sliders centered */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {sliderResults.slice(3).map((result) => (
                <motion.div key={result.id} variants={staggerItem}>
                  <BeforeAfterSlider
                    beforeImage={result.before}
                    afterImage={result.after}
                    beforeLabel={isRTL ? "قبل" : "Before"}
                    afterLabel={isRTL ? "بعد" : "After"}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>


          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-20"
          >
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-background to-gold/10 border border-primary/10">
              <h3 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                {t('startYourJourney')}
              </h3>
              <p className="text-muted-foreground">
                {t('joinHappyCustomers')}
              </p>
              <a
                href="/shop"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-primary/25"
              >
                {t('shopNow')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Results;
