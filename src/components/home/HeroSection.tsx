import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-cinematic.jpg";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full screen background */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Luxury Hair" 
          className="w-full h-full object-cover scale-105 animate-[scale_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 min-h-screen flex items-center">
        <div className={`max-w-3xl transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Polygonal Badge */}
          <div className="overflow-hidden mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-primary/60 bg-primary/10 backdrop-blur-sm animate-slide-up">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm0 3.18l6 2.73v4.96c0 4.08-2.79 7.9-6 8.94-3.21-1.04-6-4.86-6-8.94V6.91l6-2.73z"/>
              </svg>
              <span className="text-primary font-medium text-sm tracking-wide">Luxury Hair Care</span>
              <div className="flex gap-1">
                <span className="text-primary">★</span>
                <span className="text-primary">★</span>
                <span className="text-primary">★</span>
              </div>
            </div>
          </div>

          {/* Gold Brand Name */}
          <div className="overflow-hidden mb-4">
            <p className="text-primary/80 text-lg md:text-xl tracking-[0.2em] uppercase font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
              GOLD
            </p>
          </div>

          {/* Arabic Tagline */}
          <div className="overflow-hidden mb-6">
            <p className="text-primary/70 text-base md:text-lg tracking-wide font-light animate-slide-up" style={{ animationDelay: '0.15s' }}>
              {isRTL ? 'اكتشفي سر الجمال الأبدي' : 'اكتشفي سر الجمال الأبدي'}
            </p>
          </div>

          {/* Main headline - cinematic style */}
          <div className="overflow-hidden mb-8">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
              <span className="block text-primary animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {isRTL ? 'قوة' : 'The'}
              </span>
              <span className="block text-card-foreground/90 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                {isRTL ? 'اللمعان' : 'Power of'}
              </span>
              <span className="block text-primary animate-slide-up" style={{ animationDelay: '0.6s' }}>
                {isRTL ? 'الذهبي' : 'Radiance'}
              </span>
            </h1>
          </div>

          {/* Poetic description */}
          <div className="overflow-hidden mb-12">
            <p className="text-xl md:text-2xl text-card-foreground/70 leading-relaxed font-light max-w-xl animate-slide-up" style={{ animationDelay: '0.8s' }}>
              {isRTL 
                ? 'كل خصلة تحكي قصة. دعي شعرك يروي حكاية القوة والجمال والثقة التي تستحقينها.' 
                : 'Every strand tells a story. Let your hair narrate the tale of strength, beauty, and confidence you deserve.'}
            </p>
          </div>

          {/* CTA - elegant and minimal */}
          <div className="flex flex-wrap items-center gap-6 animate-slide-up" style={{ animationDelay: '1s' }}>
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-primary hover:bg-primary text-primary-foreground text-lg px-12 py-8 rounded-full font-medium transition-all duration-500 hover:shadow-gold-lg hover:scale-105"
              onClick={() => navigate('/shop')}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isRTL ? 'ابدأي رحلتك' : 'Begin Your Journey'}
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            
            <button className="group flex items-center gap-4 text-card-foreground/70 hover:text-primary transition-colors">
              <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300">
                <Play className="w-5 h-5 mr-[-2px]" />
              </div>
              <span className="text-sm uppercase tracking-wider">
                {isRTL ? 'شاهدي القصة' : 'Watch Story'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - cinematic */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-primary/50 to-primary animate-pulse" />
        <span className="text-[10px] text-primary/60 uppercase tracking-[0.4em] rotate-0">
          {isRTL ? 'اسحبي للأسفل' : 'Scroll'}
        </span>
      </div>

      {/* Side text - vertical */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-primary/30" />
        <span className="text-[10px] text-primary/50 uppercase tracking-[0.3em] writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Reselience Gold — 2026
        </span>
        <div className="w-px h-20 bg-primary/30" />
      </div>
    </section>
  );
};

export default HeroSection;