import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, Info } from 'lucide-react';

const TrackOrder = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('trackOrder')}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'تتبع حالة طلبك' : 'Track your order status'}
          </p>
        </div>

        {/* Info Card */}
        <Card className="max-w-xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>{isRTL ? 'تتبع الطلب عبر Shopify' : 'Track Order via Shopify'}</CardTitle>
            <CardDescription>
              {isRTL 
                ? 'يمكنك تتبع طلبك من خلال رابط التتبع المرسل إلى بريدك الإلكتروني'
                : 'You can track your order using the tracking link sent to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Info className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? 'بعد إتمام الطلب، ستتلقى بريداً إلكترونياً يحتوي على رابط لتتبع شحنتك'
                  : 'After placing your order, you will receive an email with a link to track your shipment'}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
