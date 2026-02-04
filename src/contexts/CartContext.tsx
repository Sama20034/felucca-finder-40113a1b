import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_size?: string | null;
  selected_color?: { name: string; name_ar: string; hex: string } | null;
  product: {
    id: string;
    name: string;
    name_ar: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
}

interface AddToCartOptions {
  size?: string | null;
  color?: { name: string; name_ar: string; hex: string } | null;
  productData?: {
    name: string;
    name_ar: string;
    price: number;
    image_url: string;
    stock_quantity?: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string | number, quantity?: number, options?: AddToCartOptions) => Promise<void>;
  updateQuantity: (itemId: string | number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'nile_store_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateCartItemId = (productId: string, size?: string | null, color?: { hex: string } | null) => {
    const sizeKey = size || 'no-size';
    const colorKey = color?.hex || 'no-color';
    return `local-${productId}-${sizeKey}-${colorKey}`;
  };

  const saveLocalCart = (items: CartItem[]) => {
    const localItems = items.map(item => ({
      product_id: String(item.product_id),
      quantity: item.quantity,
      selected_size: item.selected_size,
      selected_color: item.selected_color,
      product: item.product
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localItems));
  };

  const addToCart = async (productId: string | number, quantity: number = 1, options?: AddToCartOptions) => {
    const productIdStr = String(productId);
    const selectedSize = options?.size || null;
    const selectedColor = options?.color || null;
    
    try {
      const itemId = generateCartItemId(productIdStr, selectedSize, selectedColor);
      const existingItem = cartItems.find(item => item.id === itemId);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const updatedCart = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        saveLocalCart(updatedCart);
      } else if (options?.productData) {
        const product = {
          id: productIdStr,
          name: options.productData.name,
          name_ar: options.productData.name_ar,
          price: options.productData.price,
          image_url: options.productData.image_url,
          stock_quantity: options.productData.stock_quantity || 999
        };

        const newItem: CartItem = {
          id: itemId,
          product_id: productIdStr,
          quantity,
          selected_size: selectedSize,
          selected_color: selectedColor,
          product
        };
        const newCart = [...cartItems, newItem];
        setCartItems(newCart);
        saveLocalCart(newCart);
      }

      toast({
        title: "تمت الإضافة للسلة ✓",
        description: "تم إضافة المنتج إلى سلة المشتريات بنجاح"
      });
    } catch (error: any) {
      console.error('Cart error:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (itemId: string | number, quantity: number) => {
    if (quantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    saveLocalCart(updatedCart);
  };

  const removeFromCart = async (itemId: string | number) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    saveLocalCart(updatedCart);

    toast({
      title: "تم الحذف",
      description: "تم حذف المنتج من السلة"
    });
  };

  const clearCart = async () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
