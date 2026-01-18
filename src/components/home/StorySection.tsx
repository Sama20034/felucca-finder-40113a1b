import { useLanguage } from "@/contexts/LanguageContext";
import abstractBg from "@/assets/abstract-gold.jpg";

const StorySection = () => {
  const { isRTL } = useLanguage();

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <img src={abstractBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="container mx-auto px-4 relative">
        {/* Section intro */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="inline-block text-primary/60 text-xs tracking-[0.4em] uppercase mb-6">
            {isRTL ? 'قصتنا' : 'Our Story'}
          </span>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-8">
            {isRTL 
              ? 'ليس مجرد منتج، بل فلسفة جمال'
              : 'Not Just a Product, A Beauty Philosophy'}
          </h2>
          
          <p className="text-xl md:text-2xl text-card-foreground/70 leading-relaxed font-light">
            {isRTL 
              ? 'نؤمن أن كل امرأة تستحق أن تشعر بقوتها من خلال جمال شعرها. رحلتنا بدأت من شغف عميق بصناعة منتجات تحترم طبيعة الشعر وتعزز جماله الفطري.'
              : 'We believe every woman deserves to feel her power through the beauty of her hair. Our journey began with a deep passion for creating products that respect hair nature and enhance its innate beauty.'}
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {[
            {
              numberEn: "01",
              titleEn: "Heritage",
              titleAr: "التراث",
              textEn: "Ancient beauty secrets passed down through generations, refined with modern science.",
              textAr: "أسرار جمال قديمة توارثتها الأجيال، مُحسّنة بالعلم الحديث."
            },
            {
              numberEn: "02",
              titleEn: "Purity",
              titleAr: "النقاء",
              textEn: "Only the finest natural ingredients, sourced from the most pristine corners of the earth.",
              textAr: "فقط أنقى المكونات الطبيعية، من أنقى بقاع الأرض."
            },
            {
              numberEn: "03",
              titleEn: "Resilience",
              titleAr: "القوة",
              textEn: "Products that don't just beautify, but strengthen and transform from within.",
              textAr: "منتجات لا تُجمّل فحسب، بل تُقوّي وتُحوّل من الداخل."
            }
          ].map((pillar, index) => (
            <div 
              key={index}
              className="group text-center p-8 rounded-3xl border border-border/30 bg-card/20 backdrop-blur-sm hover:bg-card/40 hover:border-primary/30 transition-all duration-700"
            >
              <span className="block text-6xl font-serif text-primary/20 group-hover:text-primary/40 transition-colors mb-4">
                {pillar.numberEn}
              </span>
              <h3 className="font-serif text-2xl text-primary mb-4">
                {isRTL ? pillar.titleAr : pillar.titleEn}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL ? pillar.textAr : pillar.textEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySection;