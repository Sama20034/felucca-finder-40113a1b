import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const { isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      nameEn: "Sara Ahmed",
      nameAr: "سارة أحمد",
      textEn: "I've tried countless products, but Resilience Gold is truly different. My hair has never looked this healthy and vibrant. It's like a complete transformation.",
      textAr: "جربت منتجات لا تُحصى، لكن Resilience Gold مختلف حقاً. شعري لم يبدُ بهذه الصحة والحيوية من قبل. إنه تحول كامل.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    },
    {
      nameEn: "Nour Hassan",
      nameAr: "نور حسن",
      textEn: "As a professional stylist, I'm very selective about products. This serum has become my secret weapon for transforming damaged hair.",
      textAr: "كمصففة محترفة، أنا انتقائية جداً في المنتجات. هذا السيروم أصبح سلاحي السري لتحويل الشعر التالف.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
    },
    {
      nameEn: "Layla Mohamed",
      nameAr: "ليلى محمد",
      textEn: "The golden shine this product gives is unreal. I receive compliments on my hair constantly now. Worth every penny.",
      textAr: "اللمعان الذهبي الذي يمنحه هذا المنتج لا يُصدق. أتلقى إطراءات على شعري باستمرار الآن. يستحق كل قرش.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Large quote decoration */}
      <Quote className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-40 text-primary/5" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block text-primary/60 text-xs tracking-[0.4em] uppercase mb-6">
            {isRTL ? 'شهادات العملاء' : 'Testimonials'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
            {isRTL ? 'كلماتهن تُلهمنا' : 'Their Words Inspire Us'}
          </h2>
        </div>

        {/* Main testimonial - large, centered */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === activeIndex 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-primary fill-primary" />
                  ))}
                </div>

                {/* Quote text */}
                <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-card-foreground/90 leading-relaxed mb-10">
                  "{isRTL ? testimonial.textAr : testimonial.textEn}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={isRTL ? testimonial.nameAr : testimonial.nameEn}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div className="text-right">
                    <h4 className="font-semibold text-primary text-lg">
                      {isRTL ? testimonial.nameAr : testimonial.nameEn}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'عميلة موثوقة' : 'Verified Customer'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;