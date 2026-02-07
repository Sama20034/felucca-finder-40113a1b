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

  const handleCollectionClick = (handle: string, title: string) => {
    // If the collection is "Home page" or similar, go directly to shop
    const homePageHandles = ['home-page', 'homepage', 'frontpage', 'home'];
    if (homePageHandles.includes(handle.toLowerCase()) || title.toLowerCase().includes('home')) {
      navigate('/shop');
    } else {
      navigate(`/shop?collection=${handle}`);
    }
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
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3">
            {isRTL ? 'تصفحي حسب الفئة' : 'Shop by Category'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {isRTL ? 'اكتشفي مجموعاتنا المميزة' : 'Discover our exclusive collections'}
          </p>
        </motion.div>

        {/* Collections Grid - Square Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {collections.map((collection) => {
            // Rename "Home page" to "Shop page" for display
            const displayTitle = collection.node.title.toLowerCase().includes('home') 
              ? (isRTL ? 'صفحة المتجر' : 'Shop Page')
              : collection.node.title;
            
            return (
            <motion.button
              key={collection.node.id}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCollectionClick(collection.node.handle, collection.node.title)}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Collection Image */}
              {collection.node.image ? (
                <motion.img
                  src={collection.node.image.url}
                  alt={collection.node.image.altText || collection.node.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-secondary flex items-center justify-center">
                  <span className="text-4xl md:text-5xl">🏠</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-primary/80 group-hover:via-primary/40 transition-all duration-300" />

              {/* Collection Name */}
              <div className="absolute inset-0 flex items-end justify-center p-4 md:p-6">
                <div className="text-center">
                  <h3 className="text-white font-semibold text-sm md:text-lg lg:text-xl drop-shadow-lg">
                    {displayTitle}
                  </h3>
                  <motion.span 
                    className="inline-block mt-2 text-white/80 text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {isRTL ? 'تسوقي الآن ←' : 'Shop Now →'}
                  </motion.span>
                </div>
              </div>
            </motion.button>
          );
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full font-medium transition-all duration-300"
          >
            {isRTL ? 'عرض جميع الفئات' : 'View All Categories'}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopifyCollectionsSection;
