import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileSpreadsheet, Eye, MessageCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import * as XLSX from 'xlsx';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch profiles for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          if (order.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, phone')
              .eq('id', order.user_id)
              .maybeSingle();
            return { ...order, profiles: profileData };
          }
          return { ...order, profiles: null };
        })
      );

      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل الطلبات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string, note?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Save status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: parseInt(orderId),
          status: newStatus,
          note: note || null,
        });

      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة الطلب بنجاح',
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث حالة الطلب',
        variant: 'destructive',
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'awaiting_confirmation': return 'في انتظار تأكيد العميل';
      case 'shipped': return 'جاري الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_confirmation': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChangeInDialog = async (newStatus: string) => {
    if (!viewingOrder) return;
    await handleStatusChange(viewingOrder.id, newStatus);
    setViewingOrder({ ...viewingOrder, status: newStatus });
  };

  const viewOrderDetails = async (order: any) => {
    setViewingOrder(order);
    setLoadingDetails(true);
    try {
      const { data: items, error } = await supabase
        .from('order_items')
        .select('*, products(name, image_url)')
        .eq('order_id', order.id);
      
      if (error) throw error;
      setOrderItems(items || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
      setOrderItems([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter orders by status and search
  const filteredOrders = orders.filter(order => {
    const shippingName = typeof order.shipping_address === 'object' 
      ? order.shipping_address?.full_name?.toLowerCase() || ''
      : '';
    const matchesSearch = 
      String(order.id).includes(searchQuery.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shippingName.includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle single select
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ordersToExport = selectedOrders.length > 0 
      ? filteredOrders.filter(order => selectedOrders.includes(order.id))
      : filteredOrders;

    if (ordersToExport.length === 0) {
      toast({
        title: 'تنبيه',
        description: 'لا توجد طلبات للتصدير',
        variant: 'destructive',
      });
      return;
    }

    const exportData = ordersToExport.map(order => ({
      'رقم الطلب': order.order_number || String(order.id).slice(0, 8),
      'اسم العميل': typeof order.shipping_address === 'object' 
        ? order.shipping_address?.full_name || order.profiles?.full_name || 'غير محدد'
        : order.profiles?.full_name || 'غير محدد',
      'رقم الهاتف': typeof order.shipping_address === 'object' 
        ? order.shipping_address?.phone || order.profiles?.phone || '-'
        : order.profiles?.phone || '-',
      'المبلغ الفرعي': order.subtotal || 0,
      'الشحن': order.shipping_cost || 0,
      'الخصم': order.discount || 0,
      'الإجمالي': order.total || 0,
      'الحالة': getStatusText(order.status),
      'طريقة الدفع': order.payment_method === 'cash_on_delivery' ? 'الدفع عند الاستلام' : order.payment_method,
      'العنوان': typeof order.shipping_address === 'object' 
        ? `${order.shipping_address?.address || ''}, ${order.shipping_address?.city || ''}`
        : order.shipping_address || '',
      'ملاحظات': order.notes || '',
      'تاريخ الطلب': new Date(order.created_at).toLocaleDateString('ar-EG'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلبات');
    
    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: 'تم التصدير',
      description: `تم تصدير ${ordersToExport.length} طلب بنجاح`,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">إدارة الطلبات</h2>
          <Button onClick={exportToExcel} className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            تصدير Excel
            {selectedOrders.length > 0 && ` (${selectedOrders.length})`}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث برقم الطلب أو اسم العميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="فلترة بالحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد المراجعة</SelectItem>
              <SelectItem value="awaiting_confirmation">في انتظار تأكيد العميل</SelectItem>
              <SelectItem value="shipped">جاري الشحن</SelectItem>
              <SelectItem value="delivered">تم التوصيل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected count */}
        {selectedOrders.length > 0 && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm">
            تم تحديد {selectedOrders.length} طلب
          </div>
        )}

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">#{order.order_number || String(order.id).slice(0, 8)}</TableCell>
                    <TableCell>
                      {typeof order.shipping_address === 'object' 
                        ? order.shipping_address?.full_name || order.profiles?.full_name || 'غير محدد'
                        : order.profiles?.full_name || 'غير محدد'}
                    </TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {typeof order.shipping_address === 'object' 
                        ? order.shipping_address?.phone || order.profiles?.phone || '-'
                        : order.profiles?.phone || '-'}
                    </TableCell>
                    <TableCell>{order.total} ج.م</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewOrderDetails(order)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">قيد المراجعة</SelectItem>
                            <SelectItem value="awaiting_confirmation">في انتظار تأكيد العميل</SelectItem>
                            <SelectItem value="shipped">جاري الشحن</SelectItem>
                            <SelectItem value="delivered">تم التوصيل</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تفاصيل الطلب #{viewingOrder?.order_number || viewingOrder?.id?.slice(0, 8)}</DialogTitle>
            </DialogHeader>
            
            {viewingOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">معلومات العميل</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الاسم:</span>
                      <span className="font-medium">
                        {typeof viewingOrder.shipping_address === 'object' 
                          ? viewingOrder.shipping_address?.full_name || viewingOrder.profiles?.full_name || 'غير محدد'
                          : viewingOrder.profiles?.full_name || 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رقم الهاتف:</span>
                      <span className="font-medium" dir="ltr">
                        {typeof viewingOrder.shipping_address === 'object' 
                          ? viewingOrder.shipping_address?.phone || viewingOrder.profiles?.phone || '-'
                          : viewingOrder.profiles?.phone || '-'}
                      </span>
                    </div>
                    {typeof viewingOrder.shipping_address === 'object' && viewingOrder.shipping_address?.whatsapp && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">رقم الواتساب:</span>
                        <span className="font-medium" dir="ltr">{viewingOrder.shipping_address.whatsapp}</span>
                      </div>
                    )}
                    {viewingOrder.shipping_address && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">العنوان:</span>
                          <span className="font-medium text-left">
                            {typeof viewingOrder.shipping_address === 'object' 
                              ? viewingOrder.shipping_address.address 
                              : viewingOrder.shipping_address}
                          </span>
                        </div>
                        {typeof viewingOrder.shipping_address === 'object' && viewingOrder.shipping_address.city && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المدينة:</span>
                            <span className="font-medium">{viewingOrder.shipping_address.city}</span>
                          </div>
                        )}
                        {typeof viewingOrder.shipping_address === 'object' && viewingOrder.shipping_address.governorate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المحافظة:</span>
                            <span className="font-medium">{viewingOrder.shipping_address.governorate}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* WhatsApp Button */}
                  {typeof viewingOrder.shipping_address === 'object' && viewingOrder.shipping_address?.whatsapp && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                      onClick={() => {
                        const addr = viewingOrder.shipping_address;
                        const customerName = addr?.full_name || viewingOrder.profiles?.full_name || 'غير محدد';
                        const customerPhone = addr?.phone || viewingOrder.profiles?.phone || '-';
                        const customerWhatsapp = addr?.whatsapp || '-';
                        const customerAddress = addr?.address || '-';
                        const customerCity = addr?.city || '-';
                        
                        const itemsText = orderItems.map(item => 
                          `• ${item.product_name_ar || item.products?.name || item.product_name} (×${item.quantity}) - ${item.subtotal} ج.م`
                        ).join('\n');
                        
                        const message = `🛒 *طلب جديد - رقم الطلب:* #${viewingOrder.order_number || viewingOrder.id?.slice(0, 8)}

👤 *بيانات العميل:*
• الاسم: ${customerName}
• رقم الهاتف: ${customerPhone}
• رقم الواتساب: ${customerWhatsapp}
• العنوان: ${customerAddress}
• المدينة: ${customerCity}

📦 *المنتجات:*
${itemsText}

💰 *ملخص الطلب:*
• المبلغ الفرعي: ${viewingOrder.subtotal || 0} ج.م
• الشحن: ${viewingOrder.shipping_cost || 0} ج.م
• الخصم: -${viewingOrder.discount || 0} ج.م
• *الإجمالي: ${viewingOrder.total || 0} ج.م*

💳 طريقة الدفع: ${viewingOrder.payment_method === 'cash_on_delivery' ? 'الدفع عند الاستلام' : viewingOrder.payment_method}
📋 الحالة: ${getStatusText(viewingOrder.status)}

📝 ملاحظات: ${viewingOrder.notes || 'لا توجد'}`;

                        const whatsappUrl = `https://wa.me/2001001049502?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      تواصل عبر واتساب
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">المنتجات</h3>
                  {loadingDetails ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : orderItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">لا توجد منتجات</p>
                  ) : (
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                          {item.products?.image_url && (
                            <img 
                              src={item.products.image_url} 
                              alt={item.products?.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.products?.name || 'منتج غير معروف'}</p>
                            <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{item.price} ج.م</p>
                            <p className="text-sm text-muted-foreground">الإجمالي: {item.subtotal || item.price * item.quantity} ج.م</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">ملخص الطلب</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المبلغ الفرعي:</span>
                      <span>{viewingOrder.subtotal || 0} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الشحن:</span>
                      <span>{viewingOrder.shipping_cost || 0} ج.م</span>
                    </div>
                    {viewingOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم:</span>
                        <span>-{viewingOrder.discount} ج.م</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>الإجمالي:</span>
                      <span>{viewingOrder.total} ج.م</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">طريقة الدفع:</span>
                      <span>{viewingOrder.payment_method === 'cash_on_delivery' ? 'الدفع عند الاستلام' : viewingOrder.payment_method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">الحالة:</span>
                      <Select
                        value={viewingOrder.status}
                        onValueChange={handleStatusChangeInDialog}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد المراجعة</SelectItem>
                          <SelectItem value="awaiting_confirmation">في انتظار تأكيد العميل</SelectItem>
                          <SelectItem value="shipped">جاري الشحن</SelectItem>
                          <SelectItem value="delivered">تم التوصيل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الطلب:</span>
                      <span>{new Date(viewingOrder.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    {viewingOrder.notes && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-muted-foreground">ملاحظات:</span>
                          <p className="mt-1">{viewingOrder.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Orders;
