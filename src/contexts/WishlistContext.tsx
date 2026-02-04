import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  title: string;
  price: string;
  image: string;
  handle?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'shopify_wishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading] = useState(false);
  const { toast } = useToast();

  const saveToStorage = (items: WishlistItem[]) => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    setWishlistItems(items);
  };

  const addToWishlist = (product: WishlistItem) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    if (exists) {
      toast({
        title: 'تنبيه',
        description: 'المنتج موجود بالفعل في قائمة المفضلة',
      });
      return;
    }

    const newItems = [...wishlistItems, product];
    saveToStorage(newItems);
    
    toast({
      title: 'نجاح',
      description: 'تم إضافة المنتج لقائمة المفضلة',
    });
  };

  const removeFromWishlist = (productId: string) => {
    const newItems = wishlistItems.filter(item => item.id !== productId);
    saveToStorage(newItems);
    
    toast({
      title: 'نجاح',
      description: 'تم إزالة المنتج من قائمة المفضلة',
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
