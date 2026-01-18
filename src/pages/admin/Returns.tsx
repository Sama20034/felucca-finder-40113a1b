import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, RotateCcw, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface ReturnRequest {
  id: number;
  order_id: number;
  user_id: string;
  reason: string;
  refund_type: string;
  status: string;
  admin_notes: string | null;
  refund_amount: number | null;
  refund_points: number | null;
  created_at: string;
  orders: {
    order_number: string;
    total: number;
    customer_name: string;
  };
}

interface ReturnSettings {
  id: string;
  is_returns_enabled: boolean;
  allow_money_refund: boolean;
  allow_wallet_refund: boolean;
  allow_points_refund: boolean;
  return_window_days: number;
  points_bonus_percentage: number;
}

const Returns = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [settings, setSettings] = useState<ReturnSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, settingsRes] = await Promise.all([
        supabase
          .from('return_requests')
          .select(`
            *,
            orders (order_number, total, customer_name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('return_settings')
          .select('*')
          .single()
      ]);

      if (requestsRes.error) throw requestsRes.error;
      if (settingsRes.error) throw settingsRes.error;

      setRequests(requestsRes.data || []);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from('return_settings')
        .update({
          is_returns_enabled: settings.is_returns_enabled,
          allow_money_refund: settings.allow_money_refund,
          allow_wallet_refund: settings.allow_wallet_refund,
          allow_points_refund: settings.allow_points_refund,
          return_window_days: settings.return_window_days,
          points_bonus_percentage: settings.points_bonus_percentage,
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({ title: 'تم الحفظ', description: 'تم تحديث إعدادات الاسترجاع' });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({ title: 'خطأ', description: 'فشل في تحديث الإعدادات', variant: 'destructive' });
    }
  };

  const handleOpenDialog = (request: ReturnRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setNewStatus(request.status);
    setDialogOpen(true);
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const updateData: any = {
        status: newStatus,
        admin_notes: adminNotes,
      };

      // Only process refund when status changes to approved or completed
      const shouldProcessRefund = 
        (newStatus === 'approved' || newStatus === 'completed') && 
        selectedRequest.status !== 'approved' && 
        selectedRequest.status !== 'completed';

      if (shouldProcessRefund) {
        // First, deduct loyalty points that were earned from this order
        const { data: orderData } = await supabase
          .from('orders')
          .select('loyalty_points_earned')
          .eq('id', selectedRequest.order_id)
          .single();

        if (orderData?.loyalty_points_earned && orderData.loyalty_points_earned > 0) {
          // Deduct the earned points
          const { data: profile } = await supabase
            .from('profiles')
            .select('loyalty_points')
            .eq('id', selectedRequest.user_id)
            .single();

          if (profile) {
            const newPoints = Math.max(0, (profile.loyalty_points || 0) - orderData.loyalty_points_earned);
            await supabase
              .from('profiles')
              .update({ loyalty_points: newPoints })
              .eq('id', selectedRequest.user_id);

            // Record points deduction transaction
            await supabase.from('loyalty_transactions').insert({
              user_id: selectedRequest.user_id,
              points: -orderData.loyalty_points_earned,
              type: 'adjust',
              description: `خصم نقاط بسبب استرجاع الطلب ${selectedRequest.orders.order_number}`,
              order_id: selectedRequest.order_id
            });
          }
        }

        if (selectedRequest.refund_type === 'wallet' || selectedRequest.refund_type === 'money') {
          // Both wallet and money refunds go to wallet
          const refundAmount = selectedRequest.orders.total;
          updateData.refund_amount = refundAmount;

          // Add amount to user's wallet
          const { data: wallet } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', selectedRequest.user_id)
            .maybeSingle();

          if (wallet) {
            await supabase
              .from('wallets')
              .update({ balance: wallet.balance + refundAmount })
              .eq('user_id', selectedRequest.user_id);
          } else {
            // Create wallet if doesn't exist
            await supabase
              .from('wallets')
              .insert({ user_id: selectedRequest.user_id, balance: refundAmount });
          }

          // Record wallet transaction
          const description = selectedRequest.refund_type === 'wallet' 
            ? `Wallet refund for order ${selectedRequest.orders.order_number}`
            : `Refund for order ${selectedRequest.orders.order_number}`;
          const descriptionAr = selectedRequest.refund_type === 'wallet'
            ? `استرداد للمحفظة للطلب ${selectedRequest.orders.order_number}`
            : `استرداد للطلب ${selectedRequest.orders.order_number}`;

          await supabase.from('wallet_transactions').insert({
            user_id: selectedRequest.user_id,
            amount: refundAmount,
            type: 'credit',
            description,
            description_ar: descriptionAr,
            return_request_id: selectedRequest.id
          });

        } else if (selectedRequest.refund_type === 'points') {
          // Points refund
          const bonusPoints = settings?.points_bonus_percentage || 0;
          const refundPoints = Math.round(selectedRequest.orders.total * (1 + bonusPoints / 100));
          updateData.refund_points = refundPoints;

          // Update user's loyalty points in profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('loyalty_points')
            .eq('id', selectedRequest.user_id)
            .maybeSingle();

          if (profile) {
            await supabase
              .from('profiles')
              .update({ loyalty_points: (profile.loyalty_points || 0) + refundPoints })
              .eq('id', selectedRequest.user_id);
          }

          // Record loyalty transaction
          await supabase.from('loyalty_transactions').insert({
            user_id: selectedRequest.user_id,
            points: refundPoints,
            type: 'refund',
            description: `استرداد للطلب ${selectedRequest.orders.order_number}`,
            order_id: selectedRequest.order_id
          });
        }
      }

      const { error } = await supabase
        .from('return_requests')
        .update(updateData)
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({ 
        title: 'تم التحديث', 
        description: shouldProcessRefund 
          ? 'تم تحديث طلب الاسترجاع وخصم/إضافة النقاط للعميل' 
          : 'تم تحديث طلب الاسترجاع' 
      });
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({ title: 'خطأ', description: 'فشل في تحديث الطلب', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', label: 'قيد الانتظار' },
      approved: { variant: 'default', label: 'موافق عليه' },
      rejected: { variant: 'destructive', label: 'مرفوض' },
      completed: { variant: 'outline', label: 'مكتمل', className: 'bg-green-500 text-white' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الاسترجاع</h1>
        </div>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات الاسترجاع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>تفعيل نظام الاسترجاع</Label>
                    <Switch
                      checked={settings.is_returns_enabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, is_returns_enabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>السماح بالاسترداد للمحفظة</Label>
                    <Switch
                      checked={settings.allow_wallet_refund}
                      onCheckedChange={(checked) => setSettings({ ...settings, allow_wallet_refund: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>السماح بالاسترداد النقدي</Label>
                    <Switch
                      checked={settings.allow_money_refund}
                      onCheckedChange={(checked) => setSettings({ ...settings, allow_money_refund: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>السماح بالاسترداد كنقاط</Label>
                    <Switch
                      checked={settings.allow_points_refund}
                      onCheckedChange={(checked) => setSettings({ ...settings, allow_points_refund: checked })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>مدة الاسترجاع (بالأيام)</Label>
                    <Input
                      type="number"
                      value={settings.return_window_days}
                      onChange={(e) => setSettings({ ...settings, return_window_days: parseInt(e.target.value) || 14 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>نسبة المكافأة للنقاط (%)</Label>
                    <Input
                      type="number"
                      value={settings.points_bonus_percentage}
                      onChange={(e) => setSettings({ ...settings, points_bonus_percentage: parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground">عند اختيار الاسترجاع كنقاط، يحصل العميل على قيمة الطلب + نسبة المكافأة</p>
                  </div>
                </div>

                <Button onClick={handleUpdateSettings}>حفظ الإعدادات</Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Return Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              طلبات الاسترجاع
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا توجد طلبات استرجاع</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>السبب</TableHead>
                    <TableHead>نوع الاسترجاع</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono">{request.orders?.order_number}</TableCell>
                      <TableCell>{request.orders?.customer_name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.refund_type === 'wallet' ? 'محفظة' : request.refund_type === 'money' ? 'نقدي' : 'نقاط'}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.orders?.total} ج.م</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{format(new Date(request.created_at), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(request)}>
                          تعديل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل طلب الاسترجاع</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <Label>رقم الطلب</Label>
                  <p className="font-mono">{selectedRequest.orders?.order_number}</p>
                </div>
                <div>
                  <Label>السبب</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.reason}</p>
                </div>
                <div>
                  <Label>نوع الاسترجاع</Label>
                  <p>{selectedRequest.refund_type === 'money' ? 'استرداد نقدي' : 'استرداد كنقاط'}</p>
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="approved">موافق عليه</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ملاحظات الإدارة</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="أضف ملاحظات..."
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleUpdateRequest}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Returns;
