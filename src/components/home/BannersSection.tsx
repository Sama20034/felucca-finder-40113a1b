import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const BannersSection = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  
  // Flash Sale Timer - resets every 24 hours
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { hours: 23, minutes: 59, seconds: 59 };
      }
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const banners = [
    {
      id: 1,
      title: t('newArrivalsTitle'),
      subtitle: t('winterCollection'),
      discount: "NEW",
      bgColor: "from-pink-500 to-rose-400",
      icon: Sparkles,
      href: "/shop?new=true",
      hasTimer: false,
    },
    {
      id: 2,
      title: t('saleTitle'),
      subtitle: t('upToOff'),
      discount: "FLASH SALE",
      bgColor: "from-amber-500 to-orange-400",
      icon: Zap,
      href: "/shop?sale=true",
      hasTimer: true,
    },
    {
      id: 3,
      title: t('topSellers'),
      subtitle: t('mostRequested'),
      discount: "TOP",
      bgColor: "from-violet-500 to-purple-400",
      icon: Heart,
      href: "/shop?bestseller=true",
      hasTimer: false,
    },
  ];

  return (
    <section className="py-6 bg-background">
      <div className="container mx-auto px-4">
        {/* SHEIN Style Quick Banners */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {banners.map((banner) => (
            <button
              key={banner.id}
              onClick={() => navigate(banner.href)}
              className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${banner.bgColor} p-4 md:p-6 text-white ${isRTL ? 'text-right' : 'text-left'} group hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              <div className="relative z-10">
                <span className="text-xs md:text-sm font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {banner.discount}
                </span>
                <h3 className="text-sm md:text-lg font-bold mt-2">{banner.title}</h3>
                <p className="text-xs md:text-sm opacity-90 mt-1 hidden sm:block">{banner.subtitle}</p>
                
                {/* Timer for Flash Sale */}
                {banner.hasTimer && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex gap-0.5 text-[10px] md:text-xs font-mono">
                      <span className="bg-white/30 px-1 py-0.5 rounded">{formatTime(timeLeft.hours)}</span>
                      <span>:</span>
                      <span className="bg-white/30 px-1 py-0.5 rounded">{formatTime(timeLeft.minutes)}</span>
                      <span>:</span>
                      <span className="bg-white/30 px-1 py-0.5 rounded">{formatTime(timeLeft.seconds)}</span>
                    </div>
                  </div>
                )}
              </div>
              <banner.icon className={`absolute ${isRTL ? 'left-2' : 'right-2'} bottom-2 w-8 h-8 md:w-12 md:h-12 opacity-20 group-hover:opacity-40 transition-opacity`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannersSection;
