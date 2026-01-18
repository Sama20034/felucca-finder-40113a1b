import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is the product safe for children or pregnant women?",
    answer: "Yes, it is completely safe because it is natural.",
  },
  {
    question: "How many times do I use it a week?",
    answer: "Use it 3 to 4 times a week.",
  },
  {
    question: "When do the results appear?",
    answer: "Some people noticed a difference from the first week, and full results occurred within a month and a half to 3 months, depending on the case.",
  },
  {
    question: "How can I cancel an order?",
    answer: "To cancel the order, send a message to the support team on our official Facebook page.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Cash on Delivery or via InstaPay or electronic wallets *Cash services*.",
  },
  {
    question: "What is the return policy?",
    answer: `In order to ensure that we at Resilience provide the best possible experience to our customers, we offer the possibility of returning the product within 14 days from the date of receipt, according to the following conditions:

- The product must be unused and in its original condition exactly as it was received.
- The outer cover and all labels must be intact and unopened.
- The return process must be carried out using the same approved delivery method.
- Please note that any product that has been opened or used cannot be returned to maintain safety and hygiene standards.
- To apply for a return, please contact customer service from our social media page.

Contact our support team on social media or at our email: Info@resilience-gold.com`,
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#1a0a2e]">
      <Header />
      <main className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]" />
        </div>

        {/* Decorative Flowers */}
        <div className="absolute top-32 right-8 text-4xl opacity-60">🌸</div>
        <div className="absolute bottom-20 left-8 text-3xl opacity-50">🌸</div>

        {/* Header */}
        <div className="relative pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white bg-purple-500/40 px-8 py-4 rounded-full backdrop-blur-sm border border-purple-400/30 tracking-wide">
                FREQUENTLY ASKED QUESTIONS
              </h1>
            </motion.div>
          </div>
        </div>

        {/* FAQ Items */}
        <section className="relative py-8 pb-24">
          <div className="container mx-auto px-4 max-w-4xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl backdrop-blur-md cursor-pointer
                    transition-all duration-300 ease-out
                    ${openIndex === index 
                      ? 'bg-purple-900/50 border border-purple-400/30' 
                      : 'bg-purple-900/30 border border-purple-500/20 hover:bg-purple-900/40'
                    }
                  `}
                  onClick={() => toggleFAQ(index)}
                >
                  {/* Question */}
                  <div className="flex items-center justify-between p-6">
                    <h3 className="text-lg md:text-xl text-purple-300 font-medium pr-4">
                      {faq.question}
                    </h3>
                    <button className="flex-shrink-0 w-10 h-10 rounded-full border border-purple-400/50 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="text-white/90 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Gradient Line */}
                {index < faqs.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mt-4" />
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
