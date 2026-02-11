import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, DollarSign, Target, Zap, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Affiliate = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isRTL ? 'برنامج الشركاء' : 'Affiliate Program'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isRTL 
                ? 'انضمي لبرنامج الشركاء واحصلي على عمولة عن كل عملية شراء تتم من خلالك'
                : 'Join our affiliate program and earn commission on every purchase made through your referral'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
                  <DollarSign className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{isRTL ? 'عمولة مجزية' : 'Generous Commission'}</h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'احصلي على 5% عمولة من كل عملية شراء' : 'Earn 5% commission on every purchase'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{isRTL ? 'تتبع سهل' : 'Easy Tracking'}</h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'تابعي إحالاتك وأرباحك بسهولة' : 'Track your referrals and earnings easily'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{isRTL ? 'دفع سريع' : 'Fast Payouts'}</h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'استلمي أرباحك بسرعة وسهولة' : 'Receive your earnings quickly and easily'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon */}
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4 mx-auto">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>{isRTL ? 'قريباً' : 'Coming Soon'}</CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'برنامج الشركاء قيد التطوير وسيكون متاحاً قريباً'
                  : 'Our affiliate program is under development and will be available soon'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/contact')} variant="outline">
                {isRTL ? 'تواصل معنا للمزيد' : 'Contact Us for More Info'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Affiliate;
