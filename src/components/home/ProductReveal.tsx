import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Star } from "lucide-react";
import productImg from "@/assets/product-showcase.jpg";

const ProductReveal = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Product image - cinematic reveal */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow behind product */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] scale-75" />
              
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden border border-primary/20 shadow-2xl">
                <img 
                  src={productImg}
                  alt="Reselience Gold Signature Product"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-gold">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">4.9</span>
                </div>
                <span className="text-xs opacity-80">
                  {isRTL ? '+2000 تقييم' : '+2000 reviews'}
                </span>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 border border-primary/30 rounded-full" />
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary/20 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-primary/60 text-xs tracking-[0.4em] uppercase mb-6">
              {isRTL ? 'المنتج الأساسي' : 'Signature Product'}
            </span>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              {isRTL ? 'سيروم الإصلاح الذهبي' : 'Golden Repair Serum'}
            </h2>

            <p className="text-xl text-card-foreground/70 leading-relaxed mb-8">
              {isRTL 
                ? 'تركيبتنا الأيقونية التي غيرت معايير العناية بالشعر. مزيج فريد من الزيوت الثمينة والمستخلصات الطبيعية التي تعيد الحياة لشعرك.'
                : 'Our iconic formula that changed hair care standards. A unique blend of precious oils and natural extracts that bring your hair back to life.'}
            </p>

            {/* Key ingredients */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { en: 'Argan Oil', ar: 'زيت الأرغان' },
                { en: 'Keratin', ar: 'الكيراتين' },
                { en: 'Vitamin E', ar: 'فيتامين E' },
                { en: 'Gold Extract', ar: 'خلاصة الذهب' }
              ].map((ingredient, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 rounded-full border border-primary/30 text-sm text-primary/80 hover:bg-primary/10 transition-colors"
                >
                  {isRTL ? ingredient.ar : ingredient.en}
                </span>
              ))}
            </div>

            {/* Price and CTA */}
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="block text-4xl font-serif font-bold text-primary">
                  450 <span className="text-lg">{isRTL ? 'ج.م' : 'EGP'}</span>
                </span>
                <span className="text-muted-foreground line-through">599 {isRTL ? 'ج.م' : 'EGP'}</span>
              </div>

              <Button 
                size="lg"
                className="btn-gold text-lg px-10 py-7 rounded-full font-medium group"
                onClick={() => navigate('/shop')}
              >
                {isRTL ? 'اطلبيه الآن' : 'Order Now'}
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReveal;