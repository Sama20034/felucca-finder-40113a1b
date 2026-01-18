import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Store, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Category {
  id: string;
  name: string;
  name_ar: string;
  icon: string | null;
  image_url: string | null;
  product_count?: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (categoriesError) throw categoriesError;

      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("is_active", true);

          return {
            ...category,
            product_count: count || 0,
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const getCategoryName = (category: Category) => {
    return isRTL ? category.name_ar : category.name;
  };

  const getProductCountText = (count: number) => {
    if (isRTL) {
      return `${count} ${count === 1 ? "منتج" : "منتجات"}`;
    }
    return `${count} ${count === 1 ? "product" : "products"}`;
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
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
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2 animate-pulse">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted" />
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-3 w-12 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="group flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Category Image/Icon */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 ring-2 ring-border/50 group-hover:ring-primary">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={getCategoryName(category)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center">
                          {category.icon ? (
                            <span className="text-2xl sm:text-3xl">{category.icon}</span>
                          ) : (
                            <Store className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <div className="text-center w-full px-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {getCategoryName(category)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        {getProductCountText(category.product_count || 0)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Empty State */}
              {categories.length === 0 && (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL ? "سيتم إضافة الفئات قريباً" : "Categories will be added soon"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
