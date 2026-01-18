import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="hover:bg-accent hover:text-primary transition-colors"
      title={language === 'en' ? 'العربية' : 'English'}
    >
      <Globe className="w-5 h-5" />
    </Button>
  );
};

export default LanguageSwitcher;
