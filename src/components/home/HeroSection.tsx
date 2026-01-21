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

  // Animation classes based on language direction
  const slideDirection = isRTL ? 'translate-x-20' : '-translate-x-20';
  const slideIn = isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${slideDirection}`;

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full screen background with slow pan animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-[-10%] w-[120%] h-[120%] animate-[slowPan_30s_ease-in-out_infinite_alternate]">
          <img 
            src={heroBg} 
            alt="Luxury Hair" 
            className="w-full h-full object-cover"
          />
        </div>
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
        <div className="max-w-3xl">
          
          {/* Cinematic tagline */}
          <div className="overflow-hidden mb-6">
            <p className={`text-primary/70 text-sm md:text-base tracking-[0.3em] uppercase font-light transition-all duration-700 ease-out ${slideIn}`}>
              {isRTL ? 'اكتشفي سر الجمال الأبدي' : 'Discover The Secret of Eternal Beauty'}
            </p>
          </div>

          {/* Main headline - cinematic style */}
          <div className="overflow-hidden mb-8">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
              <span 
                className={`block text-primary transition-all duration-700 ease-out delay-200 ${slideIn}`}
              >
                {isRTL ? 'قوة' : 'The'}
              </span>
              <span 
                className={`block text-card-foreground/90 transition-all duration-700 ease-out delay-[400ms] ${slideIn}`}
              >
                {isRTL ? 'اللمعان' : 'Power of'}
              </span>
              <span 
                className={`block text-primary transition-all duration-700 ease-out delay-[600ms] ${slideIn}`}
              >
                {isRTL ? 'الذهبي' : 'Radiance'}
              </span>
            </h1>
          </div>

          {/* Poetic description */}
          <div className="overflow-hidden mb-12">
            <p 
              className={`text-xl md:text-2xl text-card-foreground/70 leading-relaxed font-light max-w-xl transition-all duration-700 ease-out delay-[800ms] ${slideIn}`}
            >
              {isRTL 
                ? 'كل خصلة تحكي قصة. دعي شعرك يروي حكاية القوة والجمال والثقة التي تستحقينها.' 
                : 'Every strand tells a story. Let your hair narrate the tale of strength, beauty, and confidence you deserve.'}
            </p>
          </div>

          {/* CTA - elegant and minimal */}
          <div className={`flex flex-wrap items-center gap-6 transition-all duration-700 ease-out delay-1000 ${slideIn}`}>
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