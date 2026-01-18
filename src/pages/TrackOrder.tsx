import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OrderTrackingProgress from '@/components/order/OrderTrackingProgress';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface OrderHistory {
  id: number;
  status: string;
  note: string | null;
  created_at: string;
}

interface OrderItem {
  id: number;
  product_name: string;
  product_name_ar: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_governorate: string | null;
  shipping_city: string | null;
  subtotal: number;
  shipping_cost: number | null;
  discount_amount: number | null;
  total: number;
  created_at: string;
}

const TrackOrder = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);

  // Check for order number in URL params
  useEffect(() => {
    const orderFromUrl = searchParams.get('order');
    if (orderFromUrl) {
      setOrderNumber(orderFromUrl);
    }
  }, [searchParams]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      pending: { en: 'Pending', ar: 'قيد المراجعة' },
      processing: { en: 'Processing', ar: 'جاري التجهيز' },
      shipped: { en: 'Shipped', ar: 'جاري الشحن' },
      delivered: { en: 'Delivered', ar: 'تم التوصيل' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' },
    };
    return labels[status]?.[language] || status;
  };

  const handleTrack = async () => {
    if (!orderNumber.trim() || !phone.trim()) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال رقم الطلب ورقم الهاتف' : 'Please enter order number and phone',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.toUpperCase())
        .eq('customer_phone', phone)
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        toast({
          title: isRTL ? 'لم يتم العثور على الطلب' : 'Order not found',
          description: isRTL 
            ? 'تأكد من صحة رقم الطلب ورقم الهاتف' 
            : 'Please verify the order number and phone number',
          variant: 'destructive',
        });
        setOrder(null);
        return;
      }

      setOrder(orderData);

      // Fetch order items
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id);

      setOrderItems(itemsData || []);

      // Fetch order history
      const { data: historyData } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      setOrderHistory(historyData || []);

    } catch (error) {
      console.error('Error tracking order:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء البحث عن الطلب' : 'Error searching for order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPpp', { 
      locale: isRTL ? ar : enUS 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('trackOrder')}
          </h1>
          <p className="text-muted-foreground">
            {t('trackOrderDescription')}
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-xl mx-auto mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('orderNumber')}
                </label>
                <Input
                  placeholder={isRTL ? 'مثال: ORD202412070001' : 'e.g., ORD202412070001'}
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="text-center font-mono"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('phoneNumber')}
                </label>
                <Input
                  placeholder={isRTL ? 'رقم الهاتف المسجل بالطلب' : 'Phone number used in order'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-center"
                  dir="ltr"
                />
              </div>
              <Button 
                onClick={handleTrack} 
                className="w-full gap-2"
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                {loading ? (isRTL ? 'جاري البحث...' : 'Searching...') : t('trackOrder')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Result */}
        {order && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('orderStatus')}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    #{order.order_number}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTrackingProgress status={order.status} />
              </CardContent>
            </Card>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {t('shippingAddress')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">{order.customer_phone}</span>
                  </p>
                  <p className="text-muted-foreground">{order.shipping_address}</p>
                  {order.shipping_city && (
                    <p className="text-muted-foreground">
                      {order.shipping_city}
                      {order.shipping_governorate && `, ${order.shipping_governorate}`}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {t('orderSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subtotal')}</span>
                    <span>{order.subtotal} {t('egp')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('shipping')}</span>
                    <span>{order.shipping_cost || 0} {t('egp')}</span>
                  </div>
                  {order.discount_amount && order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('discount')}</span>
                      <span>-{order.discount_amount} {t('egp')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>{t('total')}</span>
                    <span className="text-primary">{order.total} {t('egp')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('orderItems')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {isRTL && item.product_name_ar ? item.product_name_ar : item.product_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.unit_price} {t('egp')}
                        </p>
                      </div>
                      <span className="font-medium">
                        {item.total_price} {t('egp')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            {orderHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t('statusHistory')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderHistory.map((history, index) => (
                      <div 
                        key={history.id}
                        className={`flex gap-4 ${index !== orderHistory.length - 1 ? 'pb-4 border-b' : ''}`}
                      >
                        <div className={`
                          w-3 h-3 rounded-full mt-1.5 flex-shrink-0
                          ${index === 0 ? 'bg-primary' : 'bg-muted-foreground/50'}
                        `} />
                        <div className="flex-1">
                          <p className="font-medium">{getStatusLabel(history.status)}</p>
                          {history.note && (
                            <p className="text-sm text-muted-foreground">{history.note}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(history.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Date */}
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('orderDate')}: {formatDate(order.created_at)}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
