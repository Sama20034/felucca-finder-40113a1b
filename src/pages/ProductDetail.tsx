import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package } from 'lucide-react';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto py-16">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isRTL ? 'تصفح المنتجات عبر Shopify' : 'Browse Products via Shopify'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isRTL 
                ? 'يمكنك تصفح جميع المنتجات المتاحة في صفحة المتجر'
                : 'You can browse all available products on the shop page'}
            </p>
            <Button onClick={() => navigate('/shop')} size="lg">
              {isRTL ? 'تسوق الآن' : 'Shop Now'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
