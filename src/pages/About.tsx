import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Users, Target, Eye, Award, ArrowLeft } from "lucide-react";
import aboutImage from "@/assets/about-section.jpg";

const values = [
  { icon: Award, title: "الجودة", desc: "نختار منتجاتنا بعناية لضمان أفضل جودة" },
  { icon: Users, title: "خدمة العملاء", desc: "فريق دعم متميز على مدار الساعة" },
  { icon: Target, title: "الالتزام", desc: "نلتزم بتوصيل طلبك في الوقت المحدد" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <div className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">من نحن</h1>
            <p className="text-secondary-foreground/80 max-w-2xl mx-auto">
              تعرف على قصتنا ورؤيتنا وما يميزنا عن الآخرين
            </p>
          </div>
        </div>

        {/* About Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={aboutImage}
                  alt="عن متجر النيل"
                  className="rounded-2xl shadow-large w-full"
                />
              </div>
              <div>
                <span className="text-primary font-semibold">قصتنا</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">
                  متجر النيل - وجهتك الأولى للمنتجات المميزة
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  The Nile Store هو متجر أونلاين بيقدّم لك كل اللي محتاجه في مكان واحد… من منتجات منزلية عملية، لهدايا واكسسوارات مميزة تناسب كل الأذواق.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  هدفنا إننا نسهّل عليك تجربة الشراء، وتلاقي منتجات بجودة كويسة وسعر مناسب من غير وجع دماغ. بنضمن لك توصيل سريع، واختيارات متنوعة تناسب كل بيت مصري.
                </p>
                <ul className="space-y-3 mb-8">
                  {["منتجات عالية الجودة مختارة بعناية", "أسعار تنافسية ومناسبة للجميع", "شحن سريع لجميع المحافظات", "خدمة عملاء متميزة على مدار الساعة"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-2xl shadow-soft">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">رؤيتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون وجهتك الأولى للمنتجات المنزلية والهدايا في مصر، بتجربة شراء ممتعة وسريعة وآمنة.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-soft">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">أهدافنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  نسعى لتقديم تجربة تسوق سهلة وآمنة، مع منتجات منزلية وهدايا عالية الجودة وبأسعار مناسبة، وتوصيل سريع لكل عميل.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">قيمنا</h2>
              <p className="text-muted-foreground mt-2">ما يميزنا ويجعلنا الخيار الأول</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center mb-4">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-secondary-foreground mb-4">جاهز تبدأ التسوق؟</h2>
            <p className="text-secondary-foreground/80 mb-8">اكتشف مجموعتنا الواسعة من المنتجات</p>
            <Button variant="gold" size="xl" className="group">
              تسوق الآن
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
