import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/pink-wish-logo.png";

const Footer = () => {
  const { t, isRTL } = useLanguage();

  const quickLinks = [
    { nameEn: "Shop", nameAr: "المتجر", href: "/shop" },
    { nameEn: "Offers", nameAr: "العروض", href: "/offers" },
    { nameEn: "Contact Us", nameAr: "تواصل معنا", href: "/contact" },
    { nameEn: "Track Order", nameAr: "تتبع طلبك", href: "/track-order" },
    { nameEn: "Affiliate Program", nameAr: "برنامج الشركاء", href: "/affiliate" },
  ];

  const policyLinks = [
    { nameEn: "Shipping Policy", nameAr: "سياسة الشحن", href: "/shipping-policy" },
    { nameEn: "Return Policy", nameAr: "سياسة الاسترجاع", href: "/return-policy" },
    { nameEn: "Privacy Policy", nameAr: "سياسة الخصوصية", href: "/privacy-policy" },
    { nameEn: "FAQ", nameAr: "الأسئلة الشائعة", href: "/faq" },
    { nameEn: "Payment Methods", nameAr: "طرق الدفع", href: "/payment-methods" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <img src={logo} alt="Pink Wish" className="h-20 w-auto" />
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              {isRTL 
                ? 'Stop Wishing, Start Shopping! متجرك المفضل للمنتجات العصرية والهدايا المميزة والإكسسوارات الأنيقة.'
                : 'Stop Wishing, Start Shopping! Your favorite store for trendy products, unique gifts, and elegant accessories.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {isRTL ? link.nameAr : link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {isRTL ? 'السياسات' : 'Policies'}
            </h4>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {isRTL ? link.nameAr : link.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span dir="ltr">01001049502</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>info@pinkwish.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span>{isRTL ? '10 ص - 10 م' : '10 AM - 10 PM'}</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.facebook.com/pinkwish/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/pinkwish"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/201001049502"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@pinkwish"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60">
            <p className="flex items-center gap-2">
              © 2026 <span className="text-primary font-semibold">Pink Wish</span>. {t('allRightsReserved')}. {isRTL ? 'صُنع بواسطة' : 'Made by'}{' '}
              <a 
                href="https://digitfans.site/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                digitfans
              </a>
            </p>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
