import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, DollarSign, TrendingUp, Check, X, Eye, Edit, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  commission_rate: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  total_referrals: number;
  status: string;
  created_at: string;
  profile?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

interface Referral {
  id: string;
  order_id: number;
  order_total: number;
  commission_amount: number;
  status: string;
  created_at: string;
}

const AdminAffiliates = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalEarnings: 0,
    pendingPayouts: 0
  });

  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [editCommission, setEditCommission] = useState('5');
  const [payoutAmount, setPayoutAmount] = useState('');

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each affiliate
      const affiliatesWithProfiles = await Promise.all(
        (data || []).map(async (affiliate) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, phone')
            .eq('id', affiliate.user_id)
            .single();
          
          return { ...affiliate, profile };
        })
      );

      setAffiliates(affiliatesWithProfiles);

      // Calculate stats
      const total = affiliatesWithProfiles.length;
      const pending = affiliatesWithProfiles.filter(a => a.status === 'pending').length;
      const approved = affiliatesWithProfiles.filter(a => a.status === 'approved').length;
      const totalEarnings = affiliatesWithProfiles.reduce((sum, a) => sum + (a.total_earnings || 0), 0);
      const pendingPayouts = affiliatesWithProfiles.reduce((sum, a) => sum + (a.pending_earnings || 0), 0);

      setStats({ total, pending, approved, totalEarnings, pendingPayouts });
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async (affiliateId: string) => {
    try {
      const { data, error } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleApprove = async (affiliate: Affiliate) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status: 'approved' })
        .eq('id', affiliate.id);

      if (error) throw error;
      
      toast({
        title: 'تمت الموافقة',
        description: 'تم قبول المسوق في البرنامج',
      });
      fetchAffiliates();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (affiliate: Affiliate) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status: 'rejected' })
        .eq('id', affiliate.id);

      if (error) throw error;
      
      toast({
        title: 'تم الرفض',
        description: 'تم رفض طلب الانضمام',
      });
      fetchAffiliates();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = async (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    await fetchReferrals(affiliate.id);
    setShowDetailsDialog(true);
  };

  const handleEditCommission = async () => {
    if (!selectedAffiliate) return;
    
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ commission_rate: parseFloat(editCommission) })
        .eq('id', selectedAffiliate.id);

      if (error) throw error;
      
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث نسبة العمولة',
      });
      setShowEditDialog(false);
      fetchAffiliates();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handlePayout = async () => {
    if (!selectedAffiliate || !payoutAmount) return;
    
    const amount = parseFloat(payoutAmount);
    if (amount > (selectedAffiliate.pending_earnings || 0)) {
      toast({
        title: 'خطأ',
        description: 'المبلغ أكبر من الرصيد المعلق',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ 
          pending_earnings: (selectedAffiliate.pending_earnings || 0) - amount,
          paid_earnings: (selectedAffiliate.paid_earnings || 0) + amount
        })
        .eq('id', selectedAffiliate.id);

      if (error) throw error;
      
      toast({
        title: 'تم الدفع',
        description: `تم دفع ${amount} ج.م للمسوق`,
      });
      setShowPayoutDialog(false);
      setPayoutAmount('');
      fetchAffiliates();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">مفعّل</Badge>;
      case 'pending':
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة الشركاء</h1>
          <p className="text-muted-foreground mt-1">إدارة المسوقين بالعمولة ومتابعة الإحالات</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الشركاء</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات معلقة</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">شركاء مفعّلين</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي العمولات</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEarnings.toFixed(2)} ج.م</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عمولات معلقة</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayouts.toFixed(2)} ج.م</div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliates Table */}
        <Card>
          <CardHeader>
            <CardTitle>الشركاء</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المسوق</TableHead>
                  <TableHead>كود الإحالة</TableHead>
                  <TableHead>نسبة العمولة</TableHead>
                  <TableHead>الإحالات</TableHead>
                  <TableHead>الأرباح المعلقة</TableHead>
                  <TableHead>إجمالي الأرباح</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      لا يوجد شركاء حتى الآن
                    </TableCell>
                  </TableRow>
                ) : (
                  affiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{affiliate.profile?.full_name || 'غير محدد'}</p>
                          <p className="text-sm text-muted-foreground">{affiliate.profile?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded">{affiliate.referral_code}</code>
                      </TableCell>
                      <TableCell>{affiliate.commission_rate}%</TableCell>
                      <TableCell>{affiliate.total_referrals}</TableCell>
                      <TableCell>{affiliate.pending_earnings?.toFixed(2) || 0} ج.م</TableCell>
                      <TableCell>{affiliate.total_earnings?.toFixed(2) || 0} ج.م</TableCell>
                      <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {affiliate.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApprove(affiliate)}
                                className="text-green-500 hover:text-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(affiliate)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(affiliate)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAffiliate(affiliate);
                              setEditCommission(affiliate.commission_rate.toString());
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {affiliate.status === 'approved' && (affiliate.pending_earnings || 0) > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedAffiliate(affiliate);
                                setPayoutAmount(affiliate.pending_earnings?.toString() || '0');
                                setShowPayoutDialog(true);
                              }}
                              className="text-primary"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>تفاصيل الشريك</DialogTitle>
            </DialogHeader>
            
            {selectedAffiliate && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p className="font-medium">{selectedAffiliate.profile?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">البريد</p>
                    <p className="font-medium">{selectedAffiliate.profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <p className="font-medium">{selectedAffiliate.profile?.phone || 'غير محدد'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
                    <p className="font-medium">
                      {format(new Date(selectedAffiliate.created_at), 'dd MMM yyyy', { locale: ar })}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-4">الإحالات</h4>
                  {referrals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">لا توجد إحالات</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم الطلب</TableHead>
                          <TableHead>قيمة الطلب</TableHead>
                          <TableHead>العمولة</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>التاريخ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell>#{referral.order_id}</TableCell>
                            <TableCell>{referral.order_total?.toFixed(2)} ج.م</TableCell>
                            <TableCell>{referral.commission_amount?.toFixed(2)} ج.م</TableCell>
                            <TableCell>
                              <Badge variant={referral.status === 'paid' ? 'default' : 'secondary'}>
                                {referral.status === 'paid' ? 'مدفوع' : referral.status === 'approved' ? 'معتمد' : 'معلق'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(referral.created_at), 'dd/MM/yyyy', { locale: ar })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Commission Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل نسبة العمولة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>نسبة العمولة (%)</Label>
                <Input
                  type="number"
                  value={editCommission}
                  onChange={(e) => setEditCommission(e.target.value)}
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>إلغاء</Button>
              <Button onClick={handleEditCommission}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payout Dialog */}
        <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>صرف العمولة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                الرصيد المتاح: {selectedAffiliate?.pending_earnings?.toFixed(2) || 0} ج.م
              </p>
              <div>
                <Label>المبلغ المراد صرفه</Label>
                <Input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  min="0"
                  max={selectedAffiliate?.pending_earnings || 0}
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPayoutDialog(false)}>إلغاء</Button>
              <Button onClick={handlePayout}>تأكيد الدفع</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAffiliates;