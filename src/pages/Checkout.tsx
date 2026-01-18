import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Package, Tag, Users, Wallet, Star, Gift, Check, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | undefined>(undefined);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [appliedReferral, setAppliedReferral] = useState<any>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [loyaltySettings, setLoyaltySettings] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    city: '',
    address: '',
    notes: ''
  });

  const cartSignature = useMemo(
    () => cartItems.map((i) => `${i.product_id}:${i.quantity}`).join('|'),
    [cartItems]
  );

  useEffect(() => {
    fetchShippingZones();
    fetchLoyaltySettings();
    if (user) {
      fetchWalletBalance();
      fetchLoyaltyPoints();
    }
  }, [user]);

  // Fetch related products when cart changes (avoid infinite loops from unstable array refs)
  useEffect(() => {
    fetchRelatedProducts();
  }, [cartSignature]);

  const fetchShippingZones = async () => {
    try {
      const { data, error } = await supabase
        .from("shipping_zones")
        .select("*")
        .eq("type", "governorate")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setShippingZones(data || []);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const fetchWalletBalance = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setWalletBalance(data.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const fetchLoyaltyPoints = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("loyalty_points")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setLoyaltyPoints(data.loyalty_points || 0);
      }
    } catch (error) {
      console.error("Error fetching loyalty points:", error);
    }
  };

  const fetchLoyaltySettings = async () => {
    try {
      const { data, error } = await supabase
        .from("loyalty_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setLoyaltySettings(data);
      }
    } catch (error) {
      console.error("Error fetching loyalty settings:", error);
    }
  };

  const shipping = useMemo(() => {
    if (!selectedZone || shippingZones.length === 0) return 50;
    
    const zone = shippingZones.find((z) => z.id === selectedZone);
    if (!zone) return 50;

    if (zone.free_shipping_threshold && cartTotal >= zone.free_shipping_threshold) {
      return 0;
    }

    return zone.shipping_cost;
  }, [selectedZone, shippingZones, cartTotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discount_type === "percentage") {
      return Math.min(
        (cartTotal * appliedCoupon.discount_value) / 100,
        appliedCoupon.max_discount_amount || Infinity
      );
    } else {
      return appliedCoupon.discount_value;
    }
  }, [appliedCoupon, cartTotal]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: t('error'),
        description: isRTL ? "الرجاء إدخال كود الخصم" : "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setCouponLoading(true);

    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({
          title: isRTL ? "كود خاطئ" : "Invalid Code",
          description: t('invalidCoupon'),
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      const startDate = data.start_date ? new Date(data.start_date) : null;
      const endDate = data.end_date ? new Date(data.end_date) : null;

      if (startDate && now < startDate) {
        toast({
          title: isRTL ? "غير متاح" : "Not Available",
          description: isRTL ? "هذا الكوبون لم يبدأ بعد" : "This coupon hasn't started yet",
          variant: "destructive",
        });
        return;
      }

      if (endDate && now > endDate) {
        toast({
          title: isRTL ? "منتهي" : "Expired",
          description: isRTL ? "انتهت صلاحية هذا الكوبون" : "This coupon has expired",
          variant: "destructive",
        });
        return;
      }

      if (data.minimum_order_amount && cartTotal < data.minimum_order_amount) {
        toast({
          title: isRTL ? "الحد الأدنى غير محقق" : "Minimum not met",
          description: isRTL 
            ? `الحد الأدنى للطلب هو ${data.minimum_order_amount} ${t('egp')}`
            : `Minimum order is ${data.minimum_order_amount} ${t('egp')}`,
          variant: "destructive",
        });
        return;
      }

      if (data.usage_limit && data.times_used >= data.usage_limit) {
        toast({
          title: isRTL ? "انتهى الكوبون" : "Coupon exhausted",
          description: isRTL ? "تم استخدام هذا الكوبون بالكامل" : "This coupon has been fully used",
          variant: "destructive",
        });
        return;
      }

      setAppliedCoupon(data);
      toast({
        title: t('couponApplied'),
        description: isRTL
          ? `تم خصم ${data.discount_type === "percentage" ? `${data.discount_value}%` : `${data.discount_value} ${t('egp')}`}`
          : `Discount of ${data.discount_type === "percentage" ? `${data.discount_value}%` : `${data.discount_value} ${t('egp')}`} applied`,
      });
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      toast({
        title: t('error'),
        description: isRTL ? "حدث خطأ أثناء تطبيق الكوبون" : "Error applying coupon",
        variant: "destructive",
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: isRTL ? "تم الإلغاء" : "Removed",
      description: isRTL ? "تم إلغاء كود الخصم" : "Coupon code removed",
    });
  };

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) return;
    setReferralLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('referral_code', referralCode.toUpperCase())
        .eq('status', 'approved')
        .single();

      if (error || !data) {
        toast({
          title: isRTL ? 'كود غير صالح' : 'Invalid Code',
          description: isRTL ? 'كود الإحالة غير صحيح' : 'Invalid referral code',
          variant: 'destructive',
        });
        return;
      }

      setAppliedReferral(data);
      toast({
        title: isRTL ? 'تم تطبيق كود الإحالة' : 'Referral Applied',
        description: isRTL ? 'شكراً لاستخدامك كود الإحالة' : 'Thanks for using a referral code',
      });
    } catch (error) {
      console.error('Error applying referral:', error);
    } finally {
      setReferralLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    if (cartItems.length === 0) {
      setRelatedProducts([]);
      return;
    }

    try {
      // Get category IDs from cart items
      const cartProductIds = cartItems.map(item => item.product_id);
      
      // Fetch products not in cart, limit to 4 for suggestions
      const { data, error } = await supabase
        .from('products')
        .select('id, name, name_ar, price, original_price, image_url, category_id')
        .eq('is_active', true)
        .not('id', 'in', `(${cartProductIds.join(',')})`)
        .limit(4);

      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };


  // Calculate points to use (using useMemo to avoid infinite loops)
  const pointsToUse = useMemo(() => {
    if (!usePoints || loyaltyPoints <= 0 || !loyaltySettings?.is_active) return 0;
    
    const subtotalAfterDiscount = cartTotal + shipping - discount;
    const pointsValuePerPoint = loyaltySettings?.points_value || 0.1;
    const maxPointsValue = loyaltyPoints * pointsValuePerPoint;
    const applicablePointsValue = Math.min(maxPointsValue, subtotalAfterDiscount);
    return Math.ceil(applicablePointsValue / pointsValuePerPoint);
  }, [usePoints, loyaltyPoints, loyaltySettings, cartTotal, shipping, discount]);

  // Calculate points deduction in money value
  const pointsDeduction = usePoints && loyaltySettings?.is_active
    ? pointsToUse * (loyaltySettings?.points_value || 0.1)
    : 0;

  // Calculate wallet amount to use (using useMemo to avoid infinite loops)
  const walletAmountToUse = useMemo(() => {
    if (!useWallet || walletBalance <= 0) return 0;
    
    const remainingAfterPoints = cartTotal + shipping - discount - pointsDeduction;
    return Math.min(walletBalance, Math.max(0, remainingAfterPoints));
  }, [useWallet, walletBalance, cartTotal, shipping, discount, pointsDeduction]);

  const walletDeduction = useWallet ? walletAmountToUse : 0;
  const total = Math.max(0, cartTotal + shipping - discount - pointsDeduction - walletDeduction);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: isRTL ? "تنبيه" : "Notice",
        description: isRTL ? "سجل دخولك أولاً لإتمام الطلب وحفظ بياناتك" : "Please sign in to complete your order",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: t('error'),
        description: t('cartEmpty'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: user.email || null,
          status: 'pending',
          subtotal: cartTotal,
          shipping_cost: shipping,
          discount_amount: discount + pointsDeduction,
          wallet_amount_used: walletDeduction,
          loyalty_points_used: pointsToUse,
          total: total,
          coupon_code: appliedCoupon?.code || null,
          referral_code: appliedReferral?.referral_code || null,
          shipping_address: formData.address,
          shipping_city: formData.city || null,
          shipping_governorate: selectedZone ? shippingZones.find(z => z.id === selectedZone)?.name : null,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // If wallet was used, deduct from wallet balance and create transaction
      if (walletDeduction > 0) {
        // Update wallet balance
        await supabase
          .from('wallets')
          .update({ balance: walletBalance - walletDeduction })
          .eq('user_id', user.id);

        // Create wallet transaction
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            amount: -walletDeduction,
            type: 'debit',
            description: `Used for order #${order.order_number}`,
            description_ar: `استخدام في الطلب #${order.order_number}`,
            order_id: order.id
          });
      }

      // If loyalty points were used, deduct from profile and create transaction
      if (pointsToUse > 0) {
        // Update profile loyalty points
        await supabase
          .from('profiles')
          .update({ loyalty_points: loyaltyPoints - pointsToUse })
          .eq('id', user.id);

        // Create loyalty transaction
        await supabase
          .from('loyalty_transactions')
          .insert({
            user_id: user.id,
            points: -pointsToUse,
            type: 'redeem',
            description: `Used for order #${order.order_number}`,
            order_id: order.id
          });
      }

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name || item.product.name_ar,
        product_name_ar: item.product.name_ar,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.quantity * item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await clearCart();

      toast({
        title: t('orderPlacedSuccess'),
        description: `${t('orderNumber')}: ${order.order_number}`
      });

      navigate('/');
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('cartEmpty')}</h2>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'أضف منتجات لسلتك أولاً' : 'Add items to your cart first'}
            </p>
            <Button onClick={() => navigate('/shop')}>{t('shop')}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <div className="bg-secondary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              {t('checkoutTitle')}
            </h1>
            <p className="text-secondary-foreground/80">
              {isRTL ? 'املأ البيانات لإتمام طلبك' : 'Fill in your details to complete your order'}
            </p>
          </div>
        </div>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Shipping Information */}
                  <div className="bg-card rounded-xl p-6 shadow-soft">
                    <h3 className="text-xl font-bold text-foreground mb-6">{t('shippingInfo')}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">{t('fullName')}</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder={isRTL ? "أحمد محمد" : "John Doe"}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="01xxxxxxxxx"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="01xxxxxxxxx"
                          dir="ltr"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {isRTL ? 'اختياري - للتواصل معك عبر واتساب' : 'Optional - for WhatsApp communication'}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="city">{t('governorate')}</Label>
                        {shippingZones.length > 0 ? (
                          <Select value={selectedZone} onValueChange={setSelectedZone}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر المحافظة" : "Select governorate"} />
                            </SelectTrigger>
                            <SelectContent>
                              {shippingZones.map((zone) => (
                                <SelectItem key={zone.id} value={zone.id}>
                                  {isRTL ? zone.name_ar : zone.name} ({zone.shipping_cost} {t('egp')})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 text-sm text-muted-foreground">
                            {isRTL ? "جاري تحميل المحافظات..." : "Loading governorates..."}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedZone &&
                            shippingZones.find((z) => z.id === selectedZone)?.free_shipping_threshold &&
                            (isRTL
                              ? `شحن مجاني للطلبات فوق ${shippingZones.find((z) => z.id === selectedZone)?.free_shipping_threshold} ${t('egp')}`
                              : `Free shipping on orders over ${shippingZones.find((z) => z.id === selectedZone)?.free_shipping_threshold} ${t('egp')}`)}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="address">{t('address')}</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          placeholder={isRTL ? "رقم الشارع، المنطقة، معالم قريبة" : "Street, area, nearby landmarks"}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">{t('orderNotes')}</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder={isRTL ? "أي ملاحظات للتوصيل" : "Any delivery notes"}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-card rounded-xl p-6 shadow-soft">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    
                    <RadioGroup defaultValue="cash_on_delivery">
                      <div className="flex items-center space-x-2 space-x-reverse p-4 border border-border rounded-lg">
                        <RadioGroupItem value="cash_on_delivery" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold">
                              {isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? 'ادفع نقداً عند استلام طلبك' : 'Pay cash when you receive your order'}
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Payment Options - Wallet & Points */}
                    {user && (
                      <div className="mt-6 border-t border-border pt-6">
                        <h4 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-primary" />
                          {isRTL ? 'خيارات الدفع' : 'Payment Options'}
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Wallet Option */}
                          <button
                            type="button"
                            disabled={walletBalance <= 0}
                            onClick={() => setUseWallet(prev => !prev)}
                            className={`w-full p-4 rounded-lg border-2 text-start transition-all ${
                              walletBalance > 0 ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                            } ${
                              useWallet 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border bg-card hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  useWallet ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}>
                                  <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {isRTL ? 'المحفظة' : 'Wallet'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {isRTL ? 'الرصيد المتاح' : 'Available balance'}: <span className={`font-bold ${walletBalance > 0 ? 'text-primary' : 'text-muted-foreground'}`}>{walletBalance.toFixed(2)} {t('egp')}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {useWallet && walletBalance > 0 && (
                                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    -{walletAmountToUse.toFixed(2)} {t('egp')}
                                  </span>
                                )}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  useWallet ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                                }`}>
                                  {useWallet && <Check className="w-3 h-3 text-primary-foreground" />}
                                </div>
                              </div>
                            </div>
                          </button>

                          {/* Loyalty Points Option */}
                          {loyaltySettings?.is_active && (
                            <button
                              type="button"
                              disabled={loyaltyPoints <= 0}
                              onClick={() => setUsePoints(prev => !prev)}
                              className={`w-full p-4 rounded-lg border-2 text-start transition-all ${
                                loyaltyPoints > 0 ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                              } ${
                                usePoints 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border bg-card hover:border-primary/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    usePoints ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                  }`}>
                                    <Star className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {isRTL ? 'نقاط الولاء' : 'Loyalty Points'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {isRTL ? 'الرصيد المتاح' : 'Available balance'}: <span className={`font-bold ${loyaltyPoints > 0 ? 'text-primary' : 'text-muted-foreground'}`}>{loyaltyPoints} {isRTL ? 'نقطة' : 'points'}</span>
                                      {loyaltyPoints > 0 && (
                                        <>
                                          <span className="mx-1">•</span>
                                          {isRTL ? 'قيمة النقاط' : 'Points value'}: <span className="text-green-600 font-semibold">{(loyaltyPoints * (loyaltySettings?.points_value || 0.1)).toFixed(2)} {t('egp')}</span>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {usePoints && loyaltyPoints > 0 && (
                                    <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                      -{pointsDeduction.toFixed(2)} {t('egp')}
                                    </span>
                                  )}
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    usePoints ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                                  }`}>
                                    {usePoints && <Check className="w-3 h-3 text-primary-foreground" />}
                                  </div>
                                </div>
                              </div>
                              {usePoints && loyaltyPoints > 0 && (
                                <p className="text-xs text-muted-foreground mt-2 ps-13">
                                  {isRTL 
                                    ? `سيتم استخدام ${pointsToUse} نقطة` 
                                    : `${pointsToUse} points will be used`}
                                </p>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
                    <h3 className="text-xl font-bold text-foreground mb-6">{t('orderSummary')}</h3>
                    
                    {/* Coupon Code */}
                    <div className="mb-6">
                      <Label htmlFor="checkout-coupon" className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        {t('couponCode')}
                      </Label>
                      {appliedCoupon ? (
                        <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                {appliedCoupon.code}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-500">
                                {isRTL ? 'خصم' : 'Discount'} {appliedCoupon.discount_type === "percentage" 
                                  ? `${appliedCoupon.discount_value}%` 
                                  : `${appliedCoupon.discount_value} ${t('egp')}`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveCoupon}
                              className="text-red-600 hover:text-red-700"
                            >
                              {t('cancel')}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="checkout-coupon"
                            placeholder={isRTL ? "أدخل كود الخصم" : "Enter coupon code"}
                            className="flex-1"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          />
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading}
                          >
                            {couponLoading ? "..." : t('applyCoupon')}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Referral Code */}
                    <div className="mb-6">
                      <Label className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {isRTL ? 'كود الإحالة' : 'Referral Code'}
                      </Label>
                      {appliedReferral ? (
                        <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm font-semibold text-primary">{appliedReferral.referral_code}</p>
                          <p className="text-xs text-muted-foreground">{isRTL ? 'شكراً لاستخدامك كود الإحالة' : 'Thanks for using referral'}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder={isRTL ? "أدخل كود الإحالة (اختياري)" : "Referral code (optional)"}
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          />
                          <Button variant="outline" type="button" onClick={handleApplyReferral} disabled={referralLoading}>
                            {referralLoading ? "..." : isRTL ? "تطبيق" : "Apply"}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <img 
                            src={item.product.image_url} 
                            alt={isRTL ? item.product.name_ar : item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {isRTL ? item.product.name_ar : item.product.name}
                            </p>
                            {/* Display selected size and color */}
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground">
                              {item.selected_size && (
                                <span className="bg-muted px-1.5 py-0.5 rounded">
                                  {item.selected_size}
                                </span>
                              )}
                              {item.selected_color && (
                                <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
                                  <span 
                                    className="w-2.5 h-2.5 rounded-full border border-border inline-block" 
                                    style={{ backgroundColor: item.selected_color.hex }}
                                  />
                                  {isRTL ? item.selected_color.name_ar : item.selected_color.name}
                                </span>
                              )}
                            </div>
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-6 h-6 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-6 h-6 rounded-full hover:bg-destructive/20 flex items-center justify-center text-destructive ms-1 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-sm font-bold text-primary">
                                {item.product.price * item.quantity} {t('egp')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Related Products Suggestions */}
                    {relatedProducts.length > 0 && (
                      <div className="mb-6 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                          {isRTL ? 'أضف لطلبك' : 'Add to your order'}
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {relatedProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <img 
                                src={product.image_url} 
                                alt={isRTL ? product.name_ar : product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {isRTL ? product.name_ar : product.name}
                                </p>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-bold text-primary">{product.price} {t('egp')}</span>
                                  {product.original_price && product.original_price > product.price && (
                                    <span className="text-[10px] text-muted-foreground line-through">{product.original_price}</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2"
                                onClick={() => addToCart(product.id)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-3 mb-6 pt-4 border-t border-border">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('subtotal')}</span>
                        <span>{cartTotal} {t('egp')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('shipping')}</span>
                        <span>{shipping === 0 ? (isRTL ? "مجاني" : "Free") : `${shipping} ${t('egp')}`}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t('discount')}</span>
                          <span>- {discount.toFixed(2)} {t('egp')}</span>
                        </div>
                      )}
                      {pointsDeduction > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t('loyaltyPoints')} ({pointsToUse})</span>
                          <span>- {pointsDeduction.toFixed(2)} {t('egp')}</span>
                        </div>
                      )}
                      {walletDeduction > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t('wallet')}</span>
                          <span>- {walletDeduction.toFixed(2)} {t('egp')}</span>
                        </div>
                      )}
                      <hr className="border-border" />
                      <div className="flex justify-between font-bold text-foreground text-lg">
                        <span>{t('total')}</span>
                        <span className="text-primary">{total.toFixed(2)} {t('egp')}</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full group" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading 
                        ? (isRTL ? 'جاري إنشاء الطلب...' : 'Placing order...') 
                        : t('placeOrder')}
                      {isRTL 
                        ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
