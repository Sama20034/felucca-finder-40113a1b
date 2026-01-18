import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import CouponDialog from '@/components/admin/dialogs/CouponDialog';

const Coupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل الكوبونات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'تم الحذف',
        description: 'تم حذف الكوبون بنجاح',
      });

      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الكوبون',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (coupon: any) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCoupon(null);
    setDialogOpen(true);
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
          <h2 className="text-3xl font-bold text-foreground">إدارة الكوبونات</h2>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة كوبون جديد
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>نوع الخصم</TableHead>
                <TableHead>قيمة الخصم</TableHead>
                <TableHead>الحد الأدنى للطلب</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    لا توجد كوبونات
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                  return (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium font-mono">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.discount_type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                      </TableCell>
                      <TableCell>
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}%` 
                          : `${coupon.discount_value} ج.م`}
                      </TableCell>
                      <TableCell>{coupon.minimum_order_amount ? `${coupon.minimum_order_amount} ج.م` : '-'}</TableCell>
                      <TableCell>
                        {coupon.expires_at 
                          ? new Date(coupon.expires_at).toLocaleDateString('ar-EG')
                          : 'غير محدد'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isExpired ? 'bg-red-100 text-red-800' :
                          coupon.is_active ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {isExpired ? 'منتهي' : coupon.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(coupon.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={selectedCoupon}
        onSuccess={fetchCoupons}
      />
    </AdminLayout>
  );
};

export default Coupons;
