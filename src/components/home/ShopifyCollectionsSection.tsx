import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchShopifyCollections, ShopifyCollection } from "@/lib/shopify";
import { staggerContainer, staggerItem, viewportOnce } from '@/hooks/useAnimations';

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
    return null;
  }

  return (
    <section className="py-8 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <motion.span 
              className="w-1 h-6 bg-primary rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            {t('shopByCategory')}
          </h2>
          <motion.button
            whileHover={{ x: isRTL ? -5 : 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {t('viewAll')}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </motion.div>

        {/* Collections Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {collections.map((collection, index) => (
            <motion.button
              key={collection.node.id}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCollectionClick(collection.node.handle)}
              className="group flex flex-col items-center gap-2 md:gap-3 transition-all duration-300"
            >
              {/* Collection Image */}
              <motion.div 
                className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-lg"
                whileHover={{ boxShadow: '0 10px 30px -10px rgba(109, 65, 129, 0.3)' }}
              >
                {collection.node.image ? (
                  <motion.img
                    src={collection.node.image.url}
                    alt={collection.node.image.altText || collection.node.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl">🛍️</span>
                  </div>
                )}
              </motion.div>

              {/* Collection Name */}
              <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 max-w-[100px] md:max-w-[120px]">
                {collection.node.title}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShopifyCollectionsSection;
