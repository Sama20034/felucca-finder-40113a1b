import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, TrendingUp, Package, Heart, ShoppingCart, Trash2, Eye, Users, Copy, ExternalLink, MapPin, RotateCcw, Wallet, Star, Crown, Gem } from 'lucide-react';
import { CustomerTierProgress } from '@/components/loyalty/CustomerTierProgress';
import OrderTrackingProgress from '@/components/order/OrderTrackingProgress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format, differenceInDays } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface Affiliate {
  id: string;
  referral_code: string;
  commission_rate: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  total_referrals: number;
  status: string;
}

interface Profile {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  loyalty_points: number;
  total_spent: number;
}

interface LoyaltyTransaction {
  id: string;
  type: string;
  points: number;
  description: string;
  description_ar: string;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  order_items: any[];
}

interface ReturnRequest {
  id: number;
  order_id: number;
  reason: string;
  refund_type: string;
  status: string;
  admin_notes: string | null;
  refund_amount: number | null;
  refund_points: number | null;
  created_at: string;
}

interface ReturnSettings {
  is_returns_enabled: boolean;
  allow_money_refund: boolean;
  allow_wallet_refund: boolean;
  allow_points_refund: boolean;
  return_window_days: number;
  points_bonus_percentage: number;
}

interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  description_ar: string | null;
  order_id: number | null;
  return_request_id: number | null;
  created_at: string;
}

const MyAccount = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
  });
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [returnSettings, setReturnSettings] = useState<ReturnSettings | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [refundType, setRefundType] = useState('money');
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  const dateLocale = language === 'ar' ? ar : enUS;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchProfile();
      fetchTransactions();
      fetchOrders();
      fetchAffiliate();
      fetchReturnRequests();
      fetchReturnSettings();
      fetchWalletData();
    }
  }, [user, authLoading, navigate]);

  const fetchAffiliate = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!error && data) {
        setAffiliate(data);
      }
    } catch (error) {
      // User is not an affiliate
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('copied'),
      description: text,
    });
  };

  const getAffiliateStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">{t('affiliateApproved')}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{t('affiliatePending')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('affiliateRejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('error'),
        description: t('errorLoadingProfile'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_name_ar,
            quantity,
            unit_price
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchReturnRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('return_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReturnRequests(data || []);
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  const fetchReturnSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('return_settings')
        .select('*')
        .single();

      if (error) throw error;
      setReturnSettings(data);
    } catch (error) {
      console.error('Error fetching return settings:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      // Fetch wallet balance
      const { data: walletData } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      setWalletBalance(walletData?.balance || 0);

      // Fetch wallet transactions
      const { data: transactionsData, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setWalletTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const canRequestReturn = (order: Order) => {
    if (!returnSettings?.is_returns_enabled) return { canReturn: false, reason: 'returnsDisabled' };
    if (order.status === 'cancelled') return { canReturn: false, reason: 'orderCancelled' };
    const daysSinceOrder = differenceInDays(new Date(), new Date(order.created_at));
    if (daysSinceOrder > (returnSettings?.return_window_days || 14)) return { canReturn: false, reason: 'returnWindowExpired' };
    const existingReturn = returnRequests.find(r => r.order_id === order.id);
    if (existingReturn) return { canReturn: false, reason: 'returnAlreadyRequested' };
    return { canReturn: true, reason: '' };
  };

  const handleOpenReturnDialog = (order: Order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('');
    setRefundType(returnSettings?.allow_money_refund ? 'money' : 'points');
    setReturnDialogOpen(true);
  };

  const handleSubmitReturn = async () => {
    if (!selectedOrderForReturn || !returnReason.trim()) return;

    try {
      const { error } = await supabase
        .from('return_requests')
        .insert({
          order_id: selectedOrderForReturn.id,
          user_id: user?.id,
          reason: returnReason,
          refund_type: refundType,
        });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('returnSubmitted'),
      });
      setReturnDialogOpen(false);
      fetchReturnRequests();
    } catch (error) {
      console.error('Error submitting return:', error);
      toast({
        title: t('error'),
        description: 'Failed to submit return request',
        variant: 'destructive',
      });
    }
  };

  const getReturnStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', label: t('returnPending') },
      approved: { variant: 'default', label: t('returnApproved') },
      rejected: { variant: 'destructive', label: t('returnRejected') },
      completed: { variant: 'outline', label: t('returnCompleted'), className: 'bg-green-500 text-white' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('profileUpdated'),
      });

      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingProfile'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('pending'),
      confirmed: t('confirmed'),
      processing: t('processing'),
      shipped: t('shipped'),
      delivered: t('delivered'),
      cancelled: t('cancelled'),
    };
    return statusMap[status] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colorMap: Record<string, any> = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };
    return colorMap[status] || 'outline';
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'earn':
        return t('earnPoints');
      case 'redeem':
        return t('redeemPoints');
      case 'expire':
        return t('expirePoints');
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'earn':
        return 'default';
      case 'redeem':
        return 'secondary';
      case 'expire':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleAddWishlistToCart = (productId: string) => {
    addToCart(productId);
  };

  const getProductName = (item: any) => {
    return language === 'ar' ? item.products.name_ar : item.products.name;
  };

  const getOrderItemName = (item: any) => {
    return language === 'ar' ? (item.product_name_ar || item.product_name) : item.product_name;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('myAccount')}</h1>
            <p className="text-muted-foreground">{t('manageAccountInfo')}</p>
          </div>

          {/* Customer Tier Progress */}
          <div className="mb-6">
            <CustomerTierProgress 
              loyaltyPoints={profile?.loyalty_points || 0} 
              totalSpent={profile?.total_spent || 0}
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('loyaltyPoints')}</CardTitle>
                <Award className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.loyalty_points || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('availablePoints')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('totalPurchases')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.total_spent?.toFixed(2) || 0} {t('egp')}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('yourPurchaseValue')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('orders')}</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('order')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('wishlistTitle')}</CardTitle>
                <Heart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('product')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">{t('accountInfo')}</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">{t('myOrders')}</span>
              </TabsTrigger>
              <TabsTrigger value="returns" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">{t('returns')}</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">{t('wallet')}</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">{t('wishlist')}</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">{t('pointsTitle')}</span>
              </TabsTrigger>
              <TabsTrigger value="affiliate" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">{t('affiliateProgram')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t('personalInfo')}</CardTitle>
                  <CardDescription>{t('updatePersonalInfo')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">{t('fullName')}</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder={t('enterFullName')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="01xxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t('city')}</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder={language === 'ar' ? 'القاهرة' : 'Cairo'}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">{t('address')}</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder={t('streetArea')}
                        />
                      </div>
                    </div>

                    <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                      <Button type="submit" disabled={loading}>
                        {loading ? t('saving') : t('saveChangesBtn')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>{t('myOrders')}</CardTitle>
                  <CardDescription>{t('trackOrders')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('noOrdersYet')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <CardTitle className="text-base">{t('orderLabel')} #{order.order_number}</CardTitle>
                                <CardDescription>
                                  {format(new Date(order.created_at), 'dd MMM yyyy - HH:mm', { locale: dateLocale })}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getOrderStatusColor(order.status)}>
                                  {getOrderStatusLabel(order.status)}
                                </Badge>
                                <Link to={`/track-order?order=${order.order_number}`}>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {t('trackOrder')}
                                  </Button>
                                </Link>
                                {(() => {
                                  const returnStatus = canRequestReturn(order);
                                  const getReturnReasonText = (reason: string) => {
                                    switch(reason) {
                                      case 'returnsDisabled': return t('returnsDisabled');
                                      case 'orderCancelled': return t('orderCancelled');
                                      case 'returnWindowExpired': return t('returnWindowExpired');
                                      case 'returnAlreadyRequested': return t('returnAlreadyRequested');
                                      default: return '';
                                    }
                                  };
                                  return returnSettings?.is_returns_enabled && order.status !== 'cancelled' ? (
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-1"
                                        onClick={() => handleOpenReturnDialog(order)}
                                        disabled={!returnStatus.canReturn}
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        {t('requestReturn')}
                                      </Button>
                                      {!returnStatus.canReturn && returnStatus.reason && (
                                        <span className="text-xs text-muted-foreground">
                                          ({getReturnReasonText(returnStatus.reason)})
                                        </span>
                                      )}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Order Progress */}
                            <OrderTrackingProgress status={order.status} compact />
                            
                            <div className="space-y-2 mt-4">
                              {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span>{getOrderItemName(item)} × {item.quantity}</span>
                                  <span>{(item.unit_price * item.quantity).toFixed(2)} {t('egp')}</span>
                                </div>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                  <span>{t('total')}</span>
                                  <span>{order.total.toFixed(2)} {t('egp')}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>{t('wishlistTitle')}</CardTitle>
                  <CardDescription>{t('yourFavorites')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlistLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('wishlistEmpty')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.products.image_url}
                                alt={getProductName(item)}
                                className="w-24 h-24 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold mb-2 line-clamp-2">
                                  {getProductName(item)}
                                </h4>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-lg font-bold text-primary">
                                    {item.products.price} {t('egp')}
                                  </span>
                                  {item.products.original_price && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {item.products.original_price} {t('egp')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddWishlistToCart(item.product_id)}
                                    className="flex-1"
                                  >
                                    <ShoppingCart className="w-4 h-4" />
                                    {t('addToCart')}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/product/${item.product_id}`)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeFromWishlist(item.product_id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t('wallet')}</CardTitle>
                      <CardDescription>{t('walletHistory')}</CardDescription>
                    </div>
                    <div className="text-end">
                      <div className="text-sm text-muted-foreground">{t('walletBalance')}</div>
                      <div className="text-2xl font-bold text-primary">{walletBalance.toFixed(2)} {t('egp')}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {walletTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('noWalletTransactions')}</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('date')}</TableHead>
                          <TableHead>{t('type')}</TableHead>
                          <TableHead>{t('amount')}</TableHead>
                          <TableHead>{t('description')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {walletTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(new Date(transaction.created_at), 'dd MMM yyyy', { locale: dateLocale })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.type === 'credit' ? 'default' : 'secondary'}>
                                {transaction.type === 'credit' ? t('walletCredit') : t('walletDebit')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={transaction.type === 'credit' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {transaction.type === 'credit' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)} {t('egp')}
                              </span>
                            </TableCell>
                            <TableCell>
                              {language === 'ar' ? (transaction.description_ar || transaction.description) : transaction.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty">
              <Card>
                <CardHeader>
                  <CardTitle>{t('loyaltyPointsHistory')}</CardTitle>
                  <CardDescription>{t('last10Transactions')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('noTransactionsYet')}</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('date')}</TableHead>
                          <TableHead>{t('type')}</TableHead>
                          <TableHead>{t('pointsTitle')}</TableHead>
                          <TableHead>{t('description')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(new Date(transaction.created_at), 'dd MMM yyyy', { locale: dateLocale })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getTransactionTypeColor(transaction.type) as any}>
                                {getTransactionTypeLabel(transaction.type)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={transaction.type === 'earn' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {transaction.type === 'earn' ? '+' : '-'}{transaction.points}
                              </span>
                            </TableCell>
                            <TableCell>
                              {language === 'ar' ? (transaction.description_ar || transaction.description) : transaction.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affiliate Tab */}
            <TabsContent value="affiliate">
              <Card>
                <CardHeader>
                  <CardTitle>{t('affiliateProgram')}</CardTitle>
                  <CardDescription>{t('affiliateDashboard')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!affiliate ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">{t('notAffiliate')}</p>
                      <Button asChild>
                        <Link to="/affiliate">{t('joinNow')}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('affiliateStatus')}</span>
                        {getAffiliateStatusBadge(affiliate.status)}
                      </div>

                      {affiliate.status === 'approved' && (
                        <>
                          {/* Referral Code & Link */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>{t('yourReferralCode')}</Label>
                              <div className="flex gap-2">
                                <Input value={affiliate.referral_code} readOnly />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(affiliate.referral_code)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>{t('yourReferralLink')}</Label>
                              <div className="flex gap-2">
                                <Input 
                                  value={`${window.location.origin}?ref=${affiliate.referral_code}`} 
                                  readOnly 
                                  className="text-xs"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(`${window.location.origin}?ref=${affiliate.referral_code}`)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">{t('commissionRate')}</p>
                                <p className="text-2xl font-bold text-primary">{affiliate.commission_rate}%</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">{t('totalReferrals')}</p>
                                <p className="text-2xl font-bold">{affiliate.total_referrals}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">{t('pendingEarnings')}</p>
                                <p className="text-2xl font-bold text-orange-500">{affiliate.pending_earnings?.toFixed(2) || 0} {t('egp')}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">{t('totalEarnings')}</p>
                                <p className="text-2xl font-bold text-green-600">{affiliate.total_earnings?.toFixed(2) || 0} {t('egp')}</p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Link to full affiliate page */}
                          <div className="flex justify-center">
                            <Button variant="outline" asChild>
                              <Link to="/affiliate" className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                {t('view')} {t('affiliateProgram')}
                              </Link>
                            </Button>
                          </div>
                        </>
                      )}

                      {affiliate.status === 'pending' && (
                        <div className="text-center py-4 bg-muted rounded-lg">
                          <p className="text-muted-foreground">{t('affiliatePending')}</p>
                        </div>
                      )}

                      {affiliate.status === 'rejected' && (
                        <div className="text-center py-4 bg-destructive/10 rounded-lg">
                          <p className="text-destructive">{t('affiliateRejected')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Returns Tab */}
            <TabsContent value="returns">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    {t('returns')}
                  </CardTitle>
                  <CardDescription>{t('returnRequest')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!returnSettings?.is_returns_enabled ? (
                    <div className="text-center py-8">
                      <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('returnsDisabled')}</p>
                    </div>
                  ) : returnRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('noReturns')}</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('orderLabel')}</TableHead>
                          <TableHead>{t('returnReason')}</TableHead>
                          <TableHead>{t('refundType')}</TableHead>
                          <TableHead>{t('affiliateStatus')}</TableHead>
                          <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {returnRequests.map((request) => {
                          const order = orders.find(o => o.id === request.order_id);
                          return (
                            <TableRow key={request.id}>
                              <TableCell className="font-mono">#{order?.order_number || request.order_id}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {request.refund_type === 'wallet' ? t('refundAsWallet') : request.refund_type === 'money' ? t('refundAsMoney') : t('refundAsPoints')}
                                </Badge>
                              </TableCell>
                              <TableCell>{getReturnStatusBadge(request.status)}</TableCell>
                              <TableCell>{format(new Date(request.created_at), 'dd/MM/yyyy', { locale: dateLocale })}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Return Request Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('requestReturn')}</DialogTitle>
          </DialogHeader>
          {selectedOrderForReturn && (
            <div className="space-y-4">
              <div>
                <Label>{t('orderLabel')}</Label>
                <p className="font-mono">#{selectedOrderForReturn.order_number}</p>
                <p className="text-sm text-muted-foreground">{selectedOrderForReturn.total.toFixed(2)} {t('egp')}</p>
              </div>
              <div className="space-y-2">
                <Label>{t('returnReason')}</Label>
                <Textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب سبب الاسترجاع...' : 'Enter return reason...'}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('refundType')}</Label>
                <RadioGroup value={refundType} onValueChange={setRefundType}>
                  {returnSettings?.allow_wallet_refund && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        {t('refundAsWallet')}
                      </Label>
                    </div>
                  )}
                  {returnSettings?.allow_money_refund && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="money" id="money" />
                      <Label htmlFor="money">{t('refundAsMoney')}</Label>
                    </div>
                  )}
                  {returnSettings?.allow_points_refund && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="points" id="points" />
                      <Label htmlFor="points" className="flex items-center gap-2">
                        {t('refundAsPoints')}
                        {returnSettings.points_bonus_percentage > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            +{returnSettings.points_bonus_percentage}% {t('pointsBonus')}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnDialogOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleSubmitReturn} disabled={!returnReason.trim()}>{t('confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MyAccount;