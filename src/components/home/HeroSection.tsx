import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/resilience-hero.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />

      {/* Content */}
      <div className="relative container mx-auto px-4 min-h-screen flex items-center">
        <div className="max-w-2xl pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-secondary/50 backdrop-blur-sm border border-primary/30 px-6 py-3 rounded-full mb-8 animate-fade-in">
            <Crown className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium tracking-wide">
              {isRTL ? 'العناية الفاخرة بالشعر' : 'Luxury Hair Care'}
            </span>
            <div className="flex gap-1">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <Star className="w-3 h-3 text-primary fill-primary" />
              <Star className="w-3 h-3 text-primary fill-primary" />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight mb-6 animate-slide-up">
            Resilience
            <span className="block text-secondary-foreground mt-2">
              Gold
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-card-foreground/80 mb-4 animate-slide-up font-light">
            {isRTL 
              ? 'اكتشفي سر الجمال الذهبي' 
              : 'Discover the Secret of Golden Beauty'}
          </p>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed animate-slide-up max-w-xl">
            {isRTL 
              ? 'تركيبات فاخرة مستوحاة من أسرار الجمال القديمة، مصممة لمنح شعرك القوة واللمعان الذهبي الذي تستحقينه.' 
              : 'Luxurious formulations inspired by ancient beauty secrets, designed to give your hair the strength and golden radiance it deserves.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-slide-up">
            <Button 
              size="lg" 
              className="btn-gold text-lg px-10 py-7 rounded-full font-semibold group"
              onClick={() => navigate('/shop')}
            >
              <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
              {isRTL ? 'تسوقي الآن' : 'Shop Now'}
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-10 py-7 rounded-full border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-500"
              onClick={() => navigate('/shop?collection=bestsellers')}
            >
              {isRTL ? 'الأكثر مبيعاً' : 'Best Sellers'}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-8 mt-12 animate-fade-in">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-serif">100%</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'طبيعي' : 'Natural'}</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-serif">50K+</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'عميلة سعيدة' : 'Happy Clients'}</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-serif">4.9</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'تقييم' : 'Rating'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          {isRTL ? 'اكتشفي المزيد' : 'Scroll'}
        </span>
      </div>
    </section>
  );
};

export default HeroSection;