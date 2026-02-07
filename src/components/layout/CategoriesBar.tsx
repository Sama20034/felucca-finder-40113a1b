import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchShopifyCollections, ShopifyCollection } from "@/lib/shopify";

const CategoriesBar = () => {
  const { isRTL } = useLanguage();

  const { data: collections = [] } = useQuery({
    queryKey: ['shopify-collections-bar'],
    queryFn: () => fetchShopifyCollections(10),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter out "home" collection and limit to main categories
  const filteredCollections = collections.filter(
    (col: ShopifyCollection) => !col.node.title.toLowerCase().includes('home')
  );

  if (filteredCollections.length === 0) return null;

  return (
    <div className="bg-secondary/50 border-b border-border/30 hidden lg:block">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-8 py-3">
          {filteredCollections.map((collection: ShopifyCollection) => (
            <Link
              key={collection.node.id}
              to={`/shop?collection=${collection.node.handle}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative py-1
                after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:rounded-full
                hover:after:w-full after:transition-all after:duration-300"
            >
              {collection.node.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoriesBar;
