import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin, Crown, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/reselience-gold-logo.png";

const Footer = () => {
  const { isRTL } = useLanguage();

  const quickLinks = [
    { nameEn: "Shop", nameAr: "المتجر", href: "/shop" },
    { nameEn: "Results", nameAr: "النتائج", href: "/results" },
    { nameEn: "FAQ", nameAr: "الأسئلة الشائعة", href: "/faq" },
    { nameEn: "Contact Us", nameAr: "تواصل معنا", href: "/contact" },
  ];

  const policyLinks = [
    { nameEn: "Privacy Policy", nameAr: "سياسة الخصوصية", href: "/privacy-policy" },
    { nameEn: "Terms & Conditions", nameAr: "الشروط والأحكام", href: "/terms" },
    { nameEn: "Return & Exchange", nameAr: "الاسترجاع والاستبدال", href: "/return-policy" },
  ];

  return (
    <footer className="bg-[#1C092F]">
      {/* Newsletter Section */}
      <div className="border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-right w-full md:w-auto">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-[#D4AF37] mb-2">
                {isRTL ? 'انضمي لعائلة Reselience Gold' : 'Join the Reselience Gold Family'}
              </h3>
              <p className="text-[#D4AF37]/70 text-sm md:text-base">
                {isRTL ? 'احصلي على عروض حصرية ونصائح للعناية بالشعر' : 'Get exclusive offers and hair care tips'}
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your email'}
                className="flex-1 md:w-72 px-5 py-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] text-[#D4AF37] placeholder:text-[#D4AF37]/50 text-sm"
              />
              <button className="bg-[#D4AF37] text-[#1C092F] px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#D4AF37]/90 transition-colors whitespace-nowrap text-sm">
                <Sparkles className="w-4 h-4" />
                {isRTL ? 'اشتركي' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <img src={logo} alt="Reselience Gold" className="h-16 md:h-20 w-auto" />
            </div>
            <p className="text-[#D4AF37]/70 text-sm leading-relaxed mb-4 md:mb-6">
              {isRTL 
                ? 'منتجات فاخرة للعناية بالشعر، مصممة لتمنحك القوة واللمعان الذهبي الذي تستحقينه.'
                : 'Luxury hair care products designed to give you the strength and golden radiance you deserve.'}
            </p>
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37]">{isRTL ? 'جودة ملكية' : 'Royal Quality'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base md:text-lg font-bold text-[#D4AF37] mb-4 md:mb-6 flex items-center gap-2">
              <span className="w-6 md:w-8 h-0.5 bg-[#D4AF37] rounded-full"></span>
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-[#D4AF37] transition-all duration-300"></span>
                    {isRTL ? link.nameAr : link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-base md:text-lg font-bold text-[#D4AF37] mb-4 md:mb-6 flex items-center gap-2">
              <span className="w-6 md:w-8 h-0.5 bg-[#D4AF37] rounded-full"></span>
              {isRTL ? 'السياسات' : 'Policies'}
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-[#D4AF37] transition-all duration-300"></span>
                    {isRTL ? link.nameAr : link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-serif text-base md:text-lg font-bold text-[#D4AF37] mb-4 md:mb-6 flex items-center gap-2">
              <span className="w-6 md:w-8 h-0.5 bg-[#D4AF37] rounded-full"></span>
              {isRTL ? 'تواصل معنا' : 'Contact'}
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center gap-3 md:gap-4 text-sm text-[#D4AF37]/70">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <span dir="ltr">+20 103 449 9460</span>
              </li>
              <li className="flex items-center gap-3 md:gap-4 text-sm text-[#D4AF37]/70">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <span className="break-all">info@resiliencegold.com</span>
              </li>
              <li className="flex items-center gap-3 md:gap-4 text-sm text-[#D4AF37]/70">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <span>{isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6">
              <a
                href="https://www.facebook.com/share/176muen652/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C092F] hover:border-[#D4AF37] transition-all duration-300 text-[#D4AF37]"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.instagram.com/reseliencegold?igsh=bnQ1YXdqbXBpNXdt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C092F] hover:border-[#D4AF37] transition-all duration-300 text-[#D4AF37]"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@reseliencegold?_r=1&_t=ZS-93EeKimwpls"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C092F] hover:border-[#D4AF37] transition-all duration-300 text-[#D4AF37]"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/201034499460"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C092F] hover:border-[#D4AF37] transition-all duration-300 text-[#D4AF37]"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#D4AF37]/20">
        <div className="container mx-auto px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-[#D4AF37]/70">
            <p className="flex items-center gap-2 text-center">
              © 2026 <span className="text-[#D4AF37] font-serif font-semibold">Resilience Gold</span>. 
              {isRTL ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
            </p>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-5 md:h-6 opacity-60 hover:opacity-100 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 md:h-6 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;