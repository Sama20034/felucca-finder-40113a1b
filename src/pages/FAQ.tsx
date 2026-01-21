import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eye } from "lucide-react";

const FAQ = () => {
  const { t, isRTL } = useLanguage();

  const faqs = [
    {
      question: t('faqSafeQuestion'),
      answer: t('faqSafeAnswer'),
    },
    {
      question: t('faqUsageQuestion'),
      answer: t('faqUsageAnswer'),
    },
    {
      question: t('faqResultsQuestion'),
      answer: t('faqResultsAnswer'),
    },
    {
      question: t('faqCancelQuestion'),
      answer: t('faqCancelAnswer'),
    },
    {
      question: t('faqPaymentQuestion'),
      answer: t('faqPaymentAnswer'),
    },
    {
      question: t('faqReturnQuestion'),
      answer: t('faqReturnAnswer'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]">
      <Header />
      <main className="relative overflow-hidden">
        {/* Decorative flowers */}
        <div className="absolute top-20 right-10 text-4xl opacity-60 animate-pulse">🌸</div>
        <div className="absolute bottom-20 left-10 text-3xl opacity-50 animate-pulse delay-500">🌸</div>
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />

        {/* Page Header */}
        <div className="py-16 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-[#8b5cf6]/80 backdrop-blur-sm px-12 py-4 rounded-full mb-8 shadow-lg shadow-purple-500/20">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider uppercase">
                {t('frequentlyAskedQuestions')}
              </h1>
            </div>
          </div>
        </div>

        <section className="pb-20 relative z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[#2d1b4e]/60 backdrop-blur-md rounded-2xl px-8 border border-purple-500/20 shadow-xl shadow-purple-900/20 overflow-hidden"
                >
                  <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} hover:no-underline text-purple-300 font-medium py-6 text-lg group`}>
                    <span className={`flex-1 ${isRTL ? 'pl-4' : 'pr-4'}`}>{faq.question}</span>
                    <div className="w-10 h-10 rounded-full border border-purple-400/50 flex items-center justify-center group-hover:border-purple-300 transition-colors">
                      <Eye className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={`text-white/90 pb-6 text-base leading-relaxed whitespace-pre-line ${isRTL ? 'text-right' : 'text-left'}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 text-purple-300/80 text-sm">
                <span className="text-2xl">🌸</span>
                <span>{t('haveMoreQuestions')}</span>
                <span className="text-2xl">🌸</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;