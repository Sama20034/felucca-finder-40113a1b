import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Gift, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RewardDialog from '@/components/admin/dialogs/RewardDialog';

const Loyalty = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const { toast } = useToast();

  const [settingsForm, setSettingsForm] = useState({
    points_per_pound: '1',
    point_value: '1',
    min_redemption: '100',
    points_expiry_days: '365',
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchSettings(),
        fetchRewards(),
        fetchTransactions(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
        setSettingsForm({
          points_per_pound: data.points_per_pound?.toString() || '1',
          point_value: data.point_value?.toString() || '1',
          min_redemption: data.min_redemption?.toString() || '100',
          points_expiry_days: data.points_expiry_days?.toString() || '365',
          is_active: data.is_active ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*, products(name_ar)')
        .order('points_required');

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const settingsData = {
        points_per_pound: parseFloat(settingsForm.points_per_pound),
        point_value: parseFloat(settingsForm.point_value),
        min_redemption: parseInt(settingsForm.min_redemption),
        points_expiry_days: parseInt(settingsForm.points_expiry_days),
        is_active: settingsForm.is_active,
      };

      const { error } = settings
        ? await supabase
            .from('loyalty_settings')
            .update(settingsData)
            .eq('id', settings.id)
        : await supabase
            .from('loyalty_settings')
            .insert([settingsData]);

      if (error) throw error;

      toast({
        title: 'نجاح',
        description: 'تم حفظ إعدادات الولاء بنجاح',
      });

      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الإعدادات',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المكافأة؟')) return;

    try {
      const { error } = await supabase
        .from('loyalty_rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'تم الحذف',
        description: 'تم حذف المكافأة بنجاح',
      });

      fetchRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف المكافأة',
        variant: 'destructive',
      });
    }
  };

  const handleEditReward = (reward: any) => {
    setSelectedReward(reward);
    setRewardDialogOpen(true);
  };

  const handleAddReward = () => {
    setSelectedReward(null);
    setRewardDialogOpen(true);
  };

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      earn: 'ربح',
      redeem: 'استبدال',
      expire: 'انتهاء',
      refund: 'استرجاع',
    };
    return types[type] || type;
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
          <h2 className="text-3xl font-bold text-foreground">نظام الولاء</h2>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            <TabsTrigger value="rewards">المكافآت</TabsTrigger>
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات نظام الولاء</CardTitle>
                <CardDescription>تحكم في قواعد ربح واستبدال النقاط</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points_per_pound">نقاط لكل جنيه</Label>
                      <Input
                        id="points_per_pound"
                        type="number"
                        step="0.1"
                        value={settingsForm.points_per_pound}
                        onChange={(e) => setSettingsForm({ ...settingsForm, points_per_pound: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">عدد النقاط التي يربحها العميل لكل جنيه ينفقه</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="point_value">قيمة النقطة (ج.م)</Label>
                      <Input
                        id="point_value"
                        type="number"
                        step="0.01"
                        value={settingsForm.point_value}
                        onChange={(e) => setSettingsForm({ ...settingsForm, point_value: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">قيمة النقطة الواحدة بالجنيه عند الاستبدال</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_redemption">الحد الأدنى للاستبدال</Label>
                      <Input
                        id="min_redemption"
                        type="number"
                        value={settingsForm.min_redemption}
                        onChange={(e) => setSettingsForm({ ...settingsForm, min_redemption: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">الحد الأدنى من النقاط للبدء في الاستبدال</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points_expiry_days">مدة صلاحية النقاط (يوم)</Label>
                      <Input
                        id="points_expiry_days"
                        type="number"
                        value={settingsForm.points_expiry_days}
                        onChange={(e) => setSettingsForm({ ...settingsForm, points_expiry_days: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">عدد الأيام قبل انتهاء صلاحية النقاط</p>
                    </div>
                  </div>

                  <Button type="submit">حفظ الإعدادات</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">المكافآت المتاحة</h3>
              <Button onClick={handleAddReward} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة مكافأة
              </Button>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>النقاط المطلوبة</TableHead>
                    <TableHead>القيمة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        لا توجد مكافآت
                      </TableCell>
                    </TableRow>
                  ) : (
                    rewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell className="font-medium">{reward.name_ar}</TableCell>
                        <TableCell>
                          {reward.reward_type === 'discount' && 'خصم'}
                          {reward.reward_type === 'free_shipping' && 'شحن مجاني'}
                          {reward.reward_type === 'free_product' && 'منتج مجاني'}
                        </TableCell>
                        <TableCell>{reward.points_required}</TableCell>
                        <TableCell>
                          {reward.reward_type === 'discount' && `${reward.discount_value} ج.م`}
                          {reward.reward_type === 'free_product' && reward.products?.name_ar}
                          {reward.reward_type === 'free_shipping' && '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reward.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reward.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditReward(reward)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReward(reward.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <h3 className="text-xl font-semibold">سجل المعاملات</h3>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>النقاط</TableHead>
                    <TableHead>الوصف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        لا توجد معاملات
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.profiles?.full_name || '-'}</p>
                            <p className="text-xs text-muted-foreground">{transaction.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.transaction_type === 'earn' ? 'bg-green-100 text-green-800' :
                            transaction.transaction_type === 'redeem' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getTransactionTypeLabel(transaction.transaction_type)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={transaction.points_change > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.points_change > 0 ? '+' : ''}{transaction.points_change}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{transaction.description || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <RewardDialog
        open={rewardDialogOpen}
        onOpenChange={setRewardDialogOpen}
        reward={selectedReward}
        onSuccess={fetchRewards}
      />
    </AdminLayout>
  );
};

export default Loyalty;