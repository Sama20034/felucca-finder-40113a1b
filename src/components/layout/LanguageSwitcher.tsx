import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10 text-white transition-colors font-medium px-3 flex items-center gap-1"
        >
          {language === 'ar' ? 'العربية' : 'English'}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] bg-[#1C092F] border-[#D4AF37]/20 z-50">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer text-[#D4AF37] hover:bg-[#D4AF37]/10 focus:bg-[#D4AF37]/10 focus:text-[#D4AF37] ${language === 'en' ? 'bg-[#D4AF37]/20' : ''}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('ar')}
          className={`cursor-pointer text-[#D4AF37] hover:bg-[#D4AF37]/10 focus:bg-[#D4AF37]/10 focus:text-[#D4AF37] ${language === 'ar' ? 'bg-[#D4AF37]/20' : ''}`}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
