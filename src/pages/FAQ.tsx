import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "إمتى يوصل طلبي؟",
    answer: "يتم توصيل الطلبات خلال 2-5 أيام عمل حسب المحافظة. الشحن للقاهرة والجيزة عادة يكون أسرع (2-3 أيام).",
  },
  {
    question: "هل المنتجات أصلية؟",
    answer: "نعم، جميع منتجاتنا مختارة بعناية من أفضل الموردين ونضمن جودتها. نحرص على توفير منتجات عالية الجودة فقط.",
  },
  {
    question: "لو المنتج فيه مشكلة؟",
    answer: "في حالة وجود أي مشكلة بالمنتج، يمكنك التواصل معنا خلال 7 أيام من الاستلام للاستبدال أو الاسترجاع.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نوفر الدفع عند الاستلام، البطاقات الائتمانية (فيزا/ماستركارد)، المحافظ الإلكترونية (فودافون كاش، اتصالات كاش، أورانج كاش)، والتحويل البنكي.",
  },
  {
    question: "هل يمكنني تتبع طلبي؟",
    answer: "نعم، بعد شحن طلبك ستصلك رسالة برقم التتبع. يمكنك استخدامه في صفحة تتبع الطلب أو التواصل معنا للاستفسار.",
  },
  {
    question: "ما هي رسوم الشحن؟",
    answer: "رسوم الشحن تختلف حسب المنطقة. الشحن للقاهرة والجيزة يبدأ من 40 ج.م، والمحافظات الأخرى من 50 ج.م.",
  },
  {
    question: "هل يوجد حد أدنى للطلب؟",
    answer: "لا يوجد حد أدنى للطلب. يمكنك طلب أي كمية تحتاجها.",
  },
  {
    question: "كيف أتواصل مع خدمة العملاء؟",
    answer: "يمكنك التواصل معنا عبر واتساب على 01001049502، أو الاتصال على 01108383770، أو إرسال بريد إلكتروني إلى k.360store@gmail.com.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <div className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">الأسئلة الشائعة</h1>
            <p className="text-secondary-foreground/80 max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl px-6 shadow-soft border-none"
                >
                  <AccordionTrigger className="text-right hover:no-underline text-foreground font-semibold py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Still Have Questions */}
            <div className="mt-12 text-center bg-muted/50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-foreground mb-2">لم تجد إجابة سؤالك؟</h3>
              <p className="text-muted-foreground mb-4">تواصل معنا وسنرد عليك في أقرب وقت</p>
              <a
                href="https://wa.me/201001049502"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
