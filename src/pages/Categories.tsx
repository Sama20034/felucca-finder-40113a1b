import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Store, ArrowRight, ArrowLeft, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const Categories = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const handleBackClick = () => {
    navigate("/");
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mt-20">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 py-12">
          <div className="container mx-auto px-4">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-4"
            >
              <BackArrow className="w-4 h-4" />
              <span className="text-sm">{isRTL ? "العودة للرئيسية" : "Back to Home"}</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {isRTL ? "جميع الفئات" : "All Categories"}
            </h1>
            <p className="text-primary-foreground/90">
              {isRTL ? "تصفح جميع أقسام المتجر واختر ما يناسبك" : "Browse all store sections and choose what suits you"}
            </p>
          </div>
        </div>

        {/* Categories Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isRTL ? "تصفح متجر Shopify" : "Browse Shopify Store"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isRTL ? "جميع المنتجات متاحة في صفحة المتجر" : "All products are available on the shop page"}
            </p>
            <Button onClick={() => navigate('/shop')} size="lg">
              {isRTL ? "تسوق الآن" : "Shop Now"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
