import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Truck, Shield, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-fashion.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative">
      {/* Top Promo Bar */}
      <div className="bg-primary text-primary-foreground py-2.5 text-center">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            {isRTL ? 'شحن مجاني للطلبات فوق 500 ج.م' : 'Free shipping on orders over 500 EGP'}
          </span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            {isRTL ? 'إرجاع مجاني خلال 7 أيام' : '7-day free returns'}
          </span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {isRTL ? 'دفع آمن 100%' : '100% secure payment'}
          </span>
        </div>
      </div>

      {/* Main Hero */}
      <div className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-background/95 via-background/70 to-transparent`} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in border border-primary/20">
              <Sparkles className="w-4 h-4" />
              {isRTL ? 'خصم يصل إلى 70% على الملابس الشتوية' : 'Up to 70% off winter collection'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight animate-slide-up">
              {isRTL ? 'أحدث صيحات' : 'Latest Trends in'}
              <span className="text-primary block mt-2">
                {isRTL ? 'الموضة العصرية' : 'Modern Fashion'}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed animate-slide-up">
              {isRTL 
                ? 'اكتشفي تشكيلتنا الجديدة من الملابس والإكسسوارات العصرية بأسعار لا تُقاوم. توقفي عن التمني وابدأي التسوق!' 
                : 'Discover our new collection of trendy clothes and accessories at unbeatable prices. Stop wishing, start shopping!'}
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up">
              <Button 
                size="lg" 
                className="text-base px-8 py-6 shadow-pink hover:shadow-pink-lg transition-all hover:-translate-y-0.5"
                onClick={() => navigate('/shop')}
              >
                {t('shopNow')}
                {isRTL ? <ArrowLeft className="w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 border-2 hover:bg-accent"
                onClick={() => navigate('/shop?sale=true')}
              >
                {isRTL ? 'العروض الحصرية' : 'Exclusive Offers'}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
