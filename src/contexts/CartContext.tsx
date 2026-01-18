import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Helper to check if an ID is a local (non-database) ID
const isLocalId = (id: string | number): boolean => {
  return typeof id === 'string' && id.startsWith('local-');
};

interface CartItem {
  id: string | number;
  product_id: string | number;
  quantity: number;
  selected_size?: string | null;
  selected_color?: { name: string; name_ar: string; hex: string } | null;
  product: {
    id: string | number;
    name: string;
    name_ar: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
}

interface LocalCartItem {
  product_id: string;
  quantity: number;
  selected_size?: string | null;
  selected_color?: { name: string; name_ar: string; hex: string } | null;
}

interface AddToCartOptions {
  size?: string | null;
  color?: { name: string; name_ar: string; hex: string } | null;
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
  const { user } = useAuth();
  const { toast } = useToast();

  // Generate unique cart item ID based on product, size, and color (for local storage only)
  const generateCartItemId = (productId: string, size?: string | null, color?: { hex: string } | null) => {
    const sizeKey = size || 'no-size';
    const colorKey = color?.hex || 'no-color';
    return `local-${productId}-${sizeKey}-${colorKey}`;
  };

  // Load cart from localStorage for guests
  const loadLocalCart = async (): Promise<CartItem[]> => {
    const localCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!localCart) return [];

    const items: LocalCartItem[] = JSON.parse(localCart);
    
    // Fetch product details for each item
    const productIds = [...new Set(items.map(item => item.product_id))];
    const { data: products } = await supabase
      .from('products')
      .select('id, name, name_ar, price, image_url, stock_quantity')
      .in('id', productIds);

    if (!products) return [];

    return items.map(item => {
      const product = products.find(p => String(p.id) === String(item.product_id));
      return {
        id: generateCartItemId(item.product_id, item.selected_size, item.selected_color),
        product_id: item.product_id,
        quantity: item.quantity,
        selected_size: item.selected_size,
        selected_color: item.selected_color,
        product: product!
      };
    }).filter(item => item.product);
  };

  // Save cart to localStorage
  const saveLocalCart = (items: CartItem[]) => {
    const localItems: LocalCartItem[] = items
      .filter(item => isLocalId(item.id))
      .map(item => ({
        product_id: String(item.product_id),
        quantity: item.quantity,
        selected_size: item.selected_size,
        selected_color: item.selected_color
      }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localItems));
  };

  // Fetch cart items from database (for logged in users)
  const fetchDatabaseCart = async (): Promise<CartItem[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          selected_size,
          selected_color_hex,
          selected_color_name,
          selected_color_name_ar,
          product:products (
            id,
            name,
            name_ar,
            price,
            image_url,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      return data.map(item => {
        const product = Array.isArray(item.product) ? item.product[0] : item.product;
        
        // Build selected_color object if we have color data
        let selected_color: { name: string; name_ar: string; hex: string } | null = null;
        if (item.selected_color_hex && item.selected_color_hex !== '') {
          selected_color = {
            hex: item.selected_color_hex,
            name: item.selected_color_name || '',
            name_ar: item.selected_color_name_ar || ''
          };
        }
        
        return {
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          selected_size: item.selected_size && item.selected_size !== '' ? item.selected_size : null,
          selected_color,
          product
        };
      }) as CartItem[];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  };

  // Sync local cart to database when user logs in
  const syncCartToDatabase = async () => {
    if (!user) return;

    const localCart = await loadLocalCart();
    if (localCart.length === 0) return;

    try {
      // Insert local cart items to database with size/color
      for (const item of localCart) {
        const sizeValue = item.selected_size || '';
        const colorHex = item.selected_color?.hex || '';
        const colorName = item.selected_color?.name || '';
        const colorNameAr = item.selected_color?.name_ar || '';

        await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: item.product_id,
            quantity: item.quantity,
            selected_size: sizeValue,
            selected_color_hex: colorHex,
            selected_color_name: colorName,
            selected_color_name_ar: colorNameAr
          }, {
            onConflict: 'user_id,product_id,selected_size,selected_color_hex'
          });
      }

      // Clear local storage
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  // Fetch cart on mount and when user changes
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      
      if (user) {
        // Sync local cart if exists
        await syncCartToDatabase();
        // Load from database
        const dbCart = await fetchDatabaseCart();
        setCartItems(dbCart);
      } else {
        // Load from localStorage
        const localCart = await loadLocalCart();
        setCartItems(localCart);
      }
      
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  // Add to cart
  const addToCart = async (productId: string | number, quantity: number = 1, options?: AddToCartOptions) => {
    const productIdStr = String(productId);
    const selectedSize = options?.size || null;
    const selectedColor = options?.color || null;
    
    try {
      if (user) {
        // Logged in: Save to database with size/color
        const sizeValue = selectedSize || '';
        const colorHex = selectedColor?.hex || '';
        const colorName = selectedColor?.name || '';
        const colorNameAr = selectedColor?.name_ar || '';

        // Check if item already exists with same variant
        const { data: existingItems } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', productIdStr)
          .eq('selected_size', sizeValue)
          .eq('selected_color_hex', colorHex);

        if (existingItems && existingItems.length > 0) {
          // Update quantity
          const existing = existingItems[0];
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: productIdStr,
              quantity,
              selected_size: sizeValue,
              selected_color_hex: colorHex,
              selected_color_name: colorName,
              selected_color_name_ar: colorNameAr
            });
        }

        // Refresh cart from database
        const dbCart = await fetchDatabaseCart();
        setCartItems(dbCart);
      } else {
        // Guest: Save to localStorage
        const itemId = generateCartItemId(productIdStr, selectedSize, selectedColor);
        const existingItem = cartItems.find(item => item.id === itemId);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          const updatedCart = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          );
          setCartItems(updatedCart);
          saveLocalCart(updatedCart);
        } else {
          // Fetch product details
          const { data: product, error } = await supabase
            .from('products')
            .select('id, name, name_ar, price, image_url, stock_quantity')
            .eq('id', productIdStr)
            .single();

          if (error || !product) {
            toast({
              title: "خطأ في جلب بيانات المنتج",
              description: "حدث خطأ أثناء إضافة المنتج للسلة.",
              variant: "destructive"
            });
            return;
          }

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

  // Update quantity
  const updateQuantity = async (itemId: string | number, quantity: number) => {
    if (quantity < 1) return;

    try {
      if (user && !isLocalId(itemId)) {
        // Database item
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        const dbCart = await fetchDatabaseCart();
        setCartItems(dbCart);
      } else {
        // Local item
        const updatedCart = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        saveLocalCart(updatedCart);
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId: string | number) => {
    try {
      if (user && !isLocalId(itemId)) {
        // Database item
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        const dbCart = await fetchDatabaseCart();
        setCartItems(dbCart);
      } else {
        // Local item
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
        saveLocalCart(updatedCart);
      }

      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج من السلة"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (user) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      }
      
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartItems([]);
    } catch (error: any) {
      console.error('Error clearing cart:', error);
    }
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
