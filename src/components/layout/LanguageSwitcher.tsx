import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="hover:bg-accent hover:text-primary transition-colors font-medium px-3"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
