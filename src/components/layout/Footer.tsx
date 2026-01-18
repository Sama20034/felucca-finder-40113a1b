import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin, Crown, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/resilience-logo.png";

const Footer = () => {
  const { isRTL } = useLanguage();

  const quickLinks = [
    { nameEn: "Shop", nameAr: "المتجر", href: "/shop" },
    { nameEn: "FAQ", nameAr: "الأسئلة الشائعة", href: "/faq" },
    { nameEn: "Contact Us", nameAr: "تواصل معنا", href: "/contact" },
  ];

  const policyLinks = [
    { nameEn: "Privacy Policy", nameAr: "سياسة الخصوصية", href: "/privacy-policy" },
    { nameEn: "Terms & Conditions", nameAr: "الشروط والأحكام", href: "/terms" },
    { nameEn: "Return & Exchange", nameAr: "الاسترجاع والاستبدال", href: "/return-policy" },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      {/* Newsletter Section */}
      <div className="border-b border-border/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right">
            <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                {isRTL ? 'انضمي لعائلة Reselience Gold' : 'Join the Reselience Gold Family'}
              </h3>
              <p className="text-muted-foreground">
                {isRTL ? 'احصلي على عروض حصرية ونصائح للعناية بالشعر' : 'Get exclusive offers and hair care tips'}
              </p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your email'}
                className="flex-1 md:w-72 px-5 py-3 rounded-full bg-background border border-border focus:outline-none focus:border-primary text-card-foreground"
              />
              <button className="btn-gold px-8 py-3 rounded-full font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {isRTL ? 'اشتركي' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Resilience Gold" className="h-16 w-auto" />
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">Reselience</h2>
                <p className="text-xs text-muted-foreground tracking-widest uppercase">Gold</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {isRTL 
                ? 'منتجات فاخرة للعناية بالشعر، مصممة لتمنحك القوة واللمعان الذهبي الذي تستحقينه.'
                : 'Luxury hair care products designed to give you the strength and golden radiance you deserve.'}
            </p>
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm text-card-foreground">{isRTL ? 'جودة ملكية' : 'Royal Quality'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full"></span>
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300"></span>
                    {isRTL ? link.nameAr : link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full"></span>
              {isRTL ? 'السياسات' : 'Policies'}
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300"></span>
                    {isRTL ? link.nameAr : link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full"></span>
              {isRTL ? 'تواصل معنا' : 'Contact'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>info@resiliencegold.com</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>{isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary/80 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-muted-foreground"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary/80 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-muted-foreground"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary/80 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-muted-foreground"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              © 2026 <span className="text-primary font-serif font-semibold">Resilience Gold</span>. 
              {isRTL ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
            </p>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;