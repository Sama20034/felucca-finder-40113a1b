import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import BeforeAfterSlider from "@/components/home/BeforeAfterSlider";
import { staggerContainer, staggerItem, fadeInUp, viewportOnce } from "@/hooks/useAnimations";

import result1 from "@/assets/results/result-1.png";
import result2 from "@/assets/results/result-2.png";
import result3 from "@/assets/results/result-3.png";
import result4 from "@/assets/results/result-4.png";
import result5 from "@/assets/results/result-5.png";
import zBefore from "@/assets/results/z-before.jpeg";
import zAfter from "@/assets/results/z-after.jpeg";
import cBefore from "@/assets/results/c-before.jpg";
import cAfter from "@/assets/results/c-after.jpg";
import fBefore from "@/assets/results/f-before.jpeg";
import fAfter from "@/assets/results/f-after.jpeg";
import sBefore from "@/assets/results/s-before.jpeg";
import sAfter from "@/assets/results/s-after.jpeg";

const Results = () => {
  const { t, isRTL } = useLanguage();

  const sliderResults = [
    { id: 1, before: zBefore, after: zAfter },
    { id: 2, before: cBefore, after: cAfter },
    { id: 3, before: fBefore, after: fAfter },
    { id: 4, before: sBefore, after: sAfter },
  ];

  const staticResults = [
    { id: 1, image: result1 },
    { id: 2, image: result2 },
    { id: 3, image: result3 },
    { id: 4, image: result4 },
    { id: 5, image: result5 },
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {sliderResults.map((result) => (
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

          {/* Static Results Gallery */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-center text-foreground mb-8">
              {isRTL ? 'المزيد من النتائج المذهلة' : 'More Amazing Results'}
            </h2>
          </motion.div>

          {/* Creative Gallery Grid */}
          <div className="grid gap-8 md:gap-12">
            {staticResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`relative group ${
                  index % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:mr-0 md:ml-auto"
                } md:w-[85%]`}
              >
                {/* Card Container */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-gold/5 p-1">
                  <div className="relative rounded-[22px] overflow-hidden bg-background">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={result.image}
                        alt={`Transformation result ${result.id}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Before/After Labels */}
                      <div className="absolute bottom-6 left-6 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
                        <span className="text-sm font-bold text-foreground">{isRTL ? "قبل" : "Before"}</span>
                      </div>
                      <div className="absolute bottom-6 right-6 px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-full border border-primary shadow-lg">
                        <span className="text-sm font-bold text-primary-foreground">{isRTL ? "بعد" : "After"}</span>
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Duration Badge */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-primary/20 shadow-xl"
                      >
                        <span className="text-sm font-semibold text-primary flex items-center gap-2">
                          <Star className="w-4 h-4 fill-primary" />
                          {t('twoMonths')}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating Decoration */}
                <div className={`absolute -z-10 ${
                  index % 2 === 0 ? "-right-4 -bottom-4" : "-left-4 -bottom-4"
                } w-32 h-32 bg-gradient-to-br from-primary/20 to-gold/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
              </motion.div>
            ))}
          </div>

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
