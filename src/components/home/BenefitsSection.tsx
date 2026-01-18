import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Shield, Droplets, Sun } from "lucide-react";

const BenefitsSection = () => {
  const { isRTL } = useLanguage();

  const benefits = [
    {
      icon: Sparkles,
      titleEn: "Instant Shine",
      titleAr: "لمعان فوري",
      textEn: "See the difference from the first application. Your hair will radiate with a healthy, golden glow.",
      textAr: "شاهدي الفرق من أول استخدام. شعرك سيشع بتوهج ذهبي صحي."
    },
    {
      icon: Shield,
      titleEn: "Deep Repair",
      titleAr: "إصلاح عميق",
      textEn: "Penetrates each strand to repair damage from within, restoring strength and elasticity.",
      textAr: "يخترق كل خصلة لإصلاح التلف من الداخل، مستعيداً القوة والمرونة."
    },
    {
      icon: Droplets,
      titleEn: "Lasting Moisture",
      titleAr: "ترطيب دائم",
      textEn: "Locks in hydration for up to 72 hours, keeping your hair soft and manageable.",
      textAr: "يحبس الترطيب حتى 72 ساعة، محافظاً على نعومة شعرك وسهولة تصفيفه."
    },
    {
      icon: Sun,
      titleEn: "Heat Protection",
      titleAr: "حماية من الحرارة",
      textEn: "Creates an invisible shield against heat styling and environmental stressors.",
      textAr: "يُنشئ درعاً غير مرئي ضد التصفيف الحراري والعوامل البيئية."
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full border border-primary/5" />
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full border border-primary/5" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="max-w-3xl mb-20">
          <span className="inline-block text-primary/60 text-xs tracking-[0.4em] uppercase mb-6">
            {isRTL ? 'الفوائد' : 'Benefits'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            {isRTL 
              ? 'نتائج تتحدث عن نفسها'
              : 'Results That Speak for Themselves'}
          </h2>
          <p className="text-xl text-card-foreground/60 leading-relaxed">
            {isRTL 
              ? 'صُممت تركيباتنا لتقديم نتائج ملموسة تشعرين بها وترينها.'
              : 'Our formulations are designed to deliver tangible results you can feel and see.'}
          </p>
        </div>

        {/* Benefits grid - asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`group relative p-10 rounded-3xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-700 hover:border-primary/50 ${
                index % 2 === 0 ? 'md:translate-y-8' : ''
              }`}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Icon */}
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:shadow-gold transition-all duration-500">
                  <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="font-serif text-2xl md:text-3xl text-primary mb-4 group-hover:translate-x-2 transition-transform duration-500">
                  {isRTL ? benefit.titleAr : benefit.titleEn}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {isRTL ? benefit.textAr : benefit.textEn}
                </p>
              </div>

              {/* Decorative number */}
              <span className="absolute top-6 right-6 text-8xl font-serif text-primary/5 group-hover:text-primary/10 transition-colors">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;