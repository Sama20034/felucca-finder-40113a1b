import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center px-4">
          <div className="relative mb-8">
            <span className="text-[150px] md:text-[200px] font-bold text-muted/30 leading-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">😕</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">الصفحة غير موجودة</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها لمكان آخر.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button variant="default" size="lg" className="group">
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="lg" className="group">
                تصفح المتجر
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
