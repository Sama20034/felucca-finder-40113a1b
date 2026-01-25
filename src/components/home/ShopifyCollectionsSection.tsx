import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchShopifyCollections, ShopifyCollection } from "@/lib/shopify";

const ShopifyCollectionsSection = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchShopifyCollections(20);
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  const handleCollectionClick = (handle: string) => {
    navigate(`/shop?collection=${handle}`);
  };

  if (loading) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return null; // Don't show section if no collections
  }

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
            onClick={() => navigate("/shop")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {t('viewAll')}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {collections.map((collection) => (
            <button
              key={collection.node.id}
              onClick={() => handleCollectionClick(collection.node.handle)}
              className="group flex flex-col items-center gap-2 md:gap-3 transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-pink">
                {collection.node.image ? (
                  <img
                    src={collection.node.image.url}
                    alt={collection.node.image.altText || collection.node.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl">🛍️</span>
                  </div>
                )}
              </div>

              {/* Collection Name */}
              <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 max-w-[100px] md:max-w-[120px]">
                {collection.node.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyCollectionsSection;
