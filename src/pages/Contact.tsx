import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, Facebook, Instagram, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { isRTL } = useLanguage();

  const contactInfo = [
    { icon: Phone, title: isRTL ? "الهاتف" : "Phone", value: "+20 103 449 9460" },
    { icon: Mail, title: isRTL ? "البريد الإلكتروني" : "Email", value: "info@resiliencegold.com" },
    { icon: Clock, title: isRTL ? "ساعات العمل" : "Working Hours", value: isRTL ? "10 ص - 10 م" : "10 AM - 10 PM" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isRTL ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." : "Your message has been sent successfully! We will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <div className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </h1>
            <p className="text-secondary-foreground/80 max-w-2xl mx-auto">
              {isRTL ? "نحن هنا لمساعدتك! تواصل معنا في أي وقت" : "We're here to help! Contact us anytime"}
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-card p-6 rounded-2xl shadow-soft">
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {isRTL ? "معلومات التواصل" : "Contact Information"}
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <info.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{info.title}</h4>
                          <p className="text-muted-foreground text-sm" dir="ltr">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-card p-6 rounded-2xl shadow-soft">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {isRTL ? "تابعنا" : "Follow Us"}
                  </h3>
                  <div className="flex gap-3">
                    <a href="https://www.facebook.com/share/176muen652/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/reseliencegold?igsh=bnQ1YXdqbXBpNXdt" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.tiktok.com/@reseliencegold?_r=1&_t=ZS-93EeKimwpls" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/201034499460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-500 text-white p-6 rounded-2xl shadow-soft hover:bg-green-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        {isRTL ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {isRTL ? "رد سريع ومباشر" : "Quick and direct response"}
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card p-8 rounded-2xl shadow-soft">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    {isRTL ? "أرسل رسالة" : "Send a Message"}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {isRTL ? "الاسم" : "Name"}
                        </label>
                        <Input placeholder={isRTL ? "اكتب اسمك" : "Enter your name"} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {isRTL ? "البريد الإلكتروني" : "Email"}
                        </label>
                        <Input type="email" placeholder="example@email.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? "رقم الهاتف" : "Phone Number"}
                      </label>
                      <Input type="tel" placeholder="01xxxxxxxxx" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? "الموضوع" : "Subject"}
                      </label>
                      <Input placeholder={isRTL ? "موضوع الرسالة" : "Message subject"} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? "الرسالة" : "Message"}
                      </label>
                      <Textarea placeholder={isRTL ? "اكتب رسالتك هنا..." : "Write your message here..."} rows={5} required />
                    </div>
                    <Button type="submit" variant="default" size="lg" className="w-full md:w-auto">
                      <Send className="w-4 h-4" />
                      {isRTL ? "إرسال الرسالة" : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
