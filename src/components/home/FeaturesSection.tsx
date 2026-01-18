import { Sparkles, Shield, Leaf, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { isRTL } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      titleEn: "Golden Radiance",
      titleAr: "لمعان ذهبي",
      descEn: "Advanced formulas that restore your hair's natural shine",
      descAr: "تركيبات متطورة تعيد لشعرك لمعانه الطبيعي"
    },
    {
      icon: Shield,
      titleEn: "Deep Protection",
      titleAr: "حماية عميقة",
      descEn: "Shield your hair from heat and environmental damage",
      descAr: "احمي شعرك من الحرارة والعوامل البيئية"
    },
    {
      icon: Leaf,
      titleEn: "Natural Ingredients",
      titleAr: "مكونات طبيعية",
      descEn: "Premium oils and extracts from nature's finest",
      descAr: "زيوت ومستخلصات فاخرة من أفضل ما تقدمه الطبيعة"
    },
    {
      icon: Crown,
      titleEn: "Royal Results",
      titleAr: "نتائج ملكية",
      descEn: "Visible transformation from the first use",
      descAr: "تحول ملحوظ من أول استخدام"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-wider uppercase mb-4">
            <span className="w-8 h-0.5 bg-primary rounded-full" />
            {isRTL ? 'لماذا نحن' : 'Why Choose Us'}
            <span className="w-8 h-0.5 bg-primary rounded-full" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            {isRTL ? 'تجربة فاخرة للعناية بالشعر' : 'Luxury Hair Care Experience'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'منتجاتنا مصممة لتمنحك أفضل النتائج مع الحفاظ على صحة شعرك'
              : 'Our products are designed to give you the best results while maintaining hair health'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-luxury p-8 text-center group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:shadow-gold transition-all duration-500">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                {isRTL ? feature.titleAr : feature.titleEn}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isRTL ? feature.descAr : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;