import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { isRTL } = useLanguage();

  const testimonials = [
    {
      nameEn: "Sara Ahmed",
      nameAr: "سارة أحمد",
      roleEn: "Loyal Customer",
      roleAr: "عميلة دائمة",
      textEn: "The Golden Repair Serum transformed my damaged hair completely. I've never seen such amazing results!",
      textAr: "سيروم الإصلاح الذهبي حوّل شعري التالف بشكل كامل. لم أرَ نتائج مذهلة كهذه من قبل!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      nameEn: "Nour Hassan",
      nameAr: "نور حسن",
      roleEn: "Beauty Blogger",
      roleAr: "مدونة جمال",
      textEn: "Finally, a brand that delivers what it promises. My hair has never been shinier or healthier.",
      textAr: "أخيراً، علامة تجارية تقدم ما تعد به. شعري لم يكن أكثر لمعاناً وصحة من قبل.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      nameEn: "Layla Mohamed",
      nameAr: "ليلى محمد",
      roleEn: "Hair Stylist",
      roleAr: "مصففة شعر",
      textEn: "I recommend Resilience Gold to all my clients. The quality is exceptional and the results speak for themselves.",
      textAr: "أنصح كل عميلاتي بـ Resilience Gold. الجودة استثنائية والنتائج تتحدث عن نفسها.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-wider uppercase mb-4">
            <span className="w-8 h-0.5 bg-primary rounded-full" />
            {isRTL ? 'آراء العملاء' : 'Testimonials'}
            <span className="w-8 h-0.5 bg-primary rounded-full" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            {isRTL ? 'ماذا يقولون عنا' : 'What They Say'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'آلاف العميلات السعيدات يشاركن تجربتهن مع منتجاتنا'
              : 'Thousands of happy customers share their experience with our products'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-luxury p-8 relative group hover:-translate-y-2 transition-all duration-500"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/20 group-hover:text-primary/30 transition-colors" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-card-foreground/90 leading-relaxed mb-8 relative z-10">
                "{isRTL ? testimonial.textAr : testimonial.textEn}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={isRTL ? testimonial.nameAr : testimonial.nameEn}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <h4 className="font-semibold text-primary">
                    {isRTL ? testimonial.nameAr : testimonial.nameEn}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? testimonial.roleAr : testimonial.roleEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;