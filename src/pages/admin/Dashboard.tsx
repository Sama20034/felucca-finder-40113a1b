import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count and recent orders
      const { data: ordersData, count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch profiles for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          if (order.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', order.user_id)
              .maybeSingle();
            return { ...order, profiles: profileData };
          }
          return { ...order, profiles: null };
        })
      );

      // Fetch customers count
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Calculate total revenue
      const { data: ordersForRevenue } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'delivered');

      const totalRevenue = ordersForRevenue?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalCustomers: customersCount || 0,
        totalRevenue,
      });

      setRecentOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-3xl font-bold text-foreground">مرحباً بك في لوحة التحكم</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي المنتجات"
            value={stats.totalProducts}
            icon={Package}
          />
          <StatsCard
            title="إجمالي الطلبات"
            value={stats.totalOrders}
            icon={ShoppingBag}
          />
          <StatsCard
            title="إجمالي العملاء"
            value={stats.totalCustomers}
            icon={Users}
          />
          <StatsCard
            title="إجمالي الإيرادات"
            value={`${stats.totalRevenue.toFixed(2)} ج.م`}
            icon={DollarSign}
          />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا توجد طلبات حتى الآن</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.order_number || String(order.id).slice(0, 8)}</TableCell>
                      <TableCell>{order.profiles?.full_name || 'غير محدد'}</TableCell>
                      <TableCell>{order.total} ج.م</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'pending' ? 'قيد المراجعة' :
                           order.status === 'shipped' ? 'جاري الشحن' :
                           order.status === 'delivered' ? 'تم التوصيل' :
                           'ملغي'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('ar-EG')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
