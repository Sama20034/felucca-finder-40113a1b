import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FinalCTA = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <section className="py-40 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/15 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-primary/20 rounded-full" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Crown icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/30 mb-10 animate-float">
            <Crown className="w-12 h-12 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-tight mb-8">
            {isRTL 
              ? 'شعرك يستحق الأفضل'
              : 'Your Hair Deserves The Best'}
          </h2>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-card-foreground/60 leading-relaxed mb-12 max-w-2xl mx-auto">
            {isRTL 
              ? 'انضمي إلى آلاف السيدات اللواتي اكتشفن سر الجمال الذهبي. رحلتك نحو شعر أحلامك تبدأ الآن.'
              : 'Join thousands of women who discovered the secret of golden beauty. Your journey to dream hair starts now.'}
          </p>

          {/* CTA Button */}
          <Button 
            size="lg"
            className="btn-gold text-xl px-16 py-8 rounded-full font-medium group relative overflow-hidden"
            onClick={() => navigate('/shop')}
          >
            <span className="relative z-10 flex items-center gap-3">
              {isRTL ? 'ابدأي الآن' : 'Start Now'}
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
            </span>
          </Button>

          {/* Trust line */}
          <p className="mt-10 text-sm text-muted-foreground">
            {isRTL 
              ? '✨ شحن مجاني • ضمان استرجاع 30 يوم • منتجات أصلية 100%'
              : '✨ Free Shipping • 30-Day Return Guarantee • 100% Authentic'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;