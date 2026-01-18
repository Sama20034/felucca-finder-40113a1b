import { Truck, Shield, RotateCcw, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { isRTL } = useLanguage();

  const features = [
    { 
      icon: Truck, 
      title: isRTL ? "شحن سريع" : "Fast Shipping", 
      desc: isRTL ? "لجميع المحافظات" : "To all governorates" 
    },
    { 
      icon: RotateCcw, 
      title: isRTL ? "إرجاع مجاني" : "Free Returns", 
      desc: isRTL ? "خلال 7 أيام" : "Within 7 days" 
    },
    { 
      icon: Shield, 
      title: isRTL ? "دفع آمن" : "Secure Payment", 
      desc: isRTL ? "100% محمي" : "100% protected" 
    },
    { 
      icon: Award, 
      title: isRTL ? "جودة مضمونة" : "Guaranteed Quality", 
      desc: isRTL ? "منتجات أصلية" : "Original products" 
    },
  ];

  return (
    <section className="py-8 bg-accent/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        {/* Features Strip - SHEIN Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;