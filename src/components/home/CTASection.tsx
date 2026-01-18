import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import InstallAppButton from "@/components/layout/InstallAppButton";
const CTASection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: isRTL ? "تم الاشتراك بنجاح!" : "Subscribed successfully!",
        description: isRTL ? "شكراً لاشتراكك في نشرتنا البريدية" : "Thank you for subscribing to our newsletter",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-primary via-primary to-rose-500 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            {t('subscribeNewsletter')}
          </h2>
          <p className="text-primary-foreground/90 mb-6 text-sm md:text-base">
            {isRTL 
              ? 'احصلي على أحدث العروض والوصولات الجديدة مباشرة في بريدك الإلكتروني'
              : 'Get the latest offers and new arrivals directly to your email'
            }
          </p>

          {/* Subscribe Form */}
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enterEmail')}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              dir={isRTL ? 'rtl' : 'ltr'}
              required
            />
            <Button
              type="submit"
              className="bg-white text-primary hover:bg-white/90 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Shop Button */}
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
              onClick={() => navigate('/shop')}
            >
              {t('shopNow')}
              {isRTL ? <ArrowLeft className="w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            {/* Download App Button */}
            <InstallAppButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
