import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Category {
  id: string;
  name_ar: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  product_count?: number;
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  
  // Items per slide (2 rows x 4 columns = 8)
  const itemsPerSlide = 8;
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);
  
  // Minimum swipe distance
  const minSwipeDistance = 50;

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

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const getCurrentSlideItems = () => {
    const start = currentSlide * itemsPerSlide;
    return categories.slice(start, start + itemsPerSlide);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // RTL: swipe left = previous, swipe right = next
    if (isLeftSwipe) {
      prevSlide();
    }
    if (isRightSwipe) {
      nextSlide();
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted" />
                <div className="h-3 w-14 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const CategoryItem = ({ category }: { category: Category }) => (
    <button
      onClick={() => handleCategoryClick(category.id)}
      className="group flex flex-col items-center gap-2 md:gap-3 transition-all duration-300"
    >
      {/* Category Image */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-pink">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={isRTL ? category.name_ar : category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <span className="text-xl md:text-2xl">👗</span>
          </div>
        )}
      </div>

      {/* Category Name */}
      <span className="text-[10px] md:text-xs lg:text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 max-w-[80px] md:max-w-[100px]">
        {isRTL ? category.name_ar : category.name}
      </span>
    </button>
  );

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {t('shopByCategory')}
          </h2>
          <button
            onClick={() => navigate("/categories")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {t('viewAll')}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Swipeable Categories Slider */}
        <div 
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Categories Grid (8 items on desktop, 4 on mobile) */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 lg:gap-4 transition-all duration-300 ease-out">
            {getCurrentSlideItems().map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-primary/50"
                }`}
                aria-label={`صفحة ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
