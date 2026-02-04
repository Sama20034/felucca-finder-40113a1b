import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const shopifyItems = useCartStore(state => state.items);
  const shopifyCheckoutUrl = useCartStore(state => state.getCheckoutUrl());
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    notes: ''
  });

  // If using Shopify cart, redirect to Shopify checkout
  if (shopifyItems.length > 0 && shopifyCheckoutUrl) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12 mt-20">
          <div className="text-center max-w-md">
            <ShoppingBag className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'إتمام الطلب عبر شوبيفاي' : 'Complete Order via Shopify'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isRTL 
                ? 'سيتم توجيهك إلى صفحة الدفع الآمنة' 
                : 'You will be redirected to the secure payment page'}
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = shopifyCheckoutUrl}
              className="w-full"
            >
              {isRTL ? 'المتابعة للدفع' : 'Proceed to Payment'}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12 mt-20">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isRTL ? 'السلة فارغة' : 'Cart is Empty'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'أضف منتجات لسلتك أولاً' : 'Add items to your cart first'}
            </p>
            <Button onClick={() => navigate('/shop')}>
              {isRTL ? 'تسوق الآن' : 'Shop Now'}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Simple order confirmation without database
      await clearCart();
      
      toast({
        title: isRTL ? 'تم الطلب بنجاح' : 'Order Placed Successfully',
        description: isRTL ? 'سنتواصل معك قريباً' : 'We will contact you soon'
      });

      navigate('/');
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const shipping = 50;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">
          {isRTL ? 'إتمام الطلب' : 'Checkout'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold mb-6">
              {isRTL ? 'بيانات التوصيل' : 'Delivery Information'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{isRTL ? 'الاسم الكامل *' : 'Full Name *'}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{isRTL ? 'رقم الهاتف *' : 'Phone Number *'}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{isRTL ? 'العنوان *' : 'Address *'}</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{isRTL ? 'ملاحظات' : 'Notes'}</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isRTL ? 'تأكيد الطلب' : 'Confirm Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-xl p-6 border border-border h-fit">
            <h2 className="text-xl font-bold mb-6">
              {isRTL ? 'ملخص الطلب' : 'Order Summary'}
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{isRTL ? item.product.name_ar : item.product.name}</p>
                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="font-bold">{item.product.price * item.quantity} {isRTL ? 'ج.م' : 'EGP'}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{cartTotal} {isRTL ? 'ج.م' : 'EGP'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRTL ? 'الشحن' : 'Shipping'}</span>
                <span>{shipping} {isRTL ? 'ج.م' : 'EGP'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className="text-primary">{total} {isRTL ? 'ج.م' : 'EGP'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
