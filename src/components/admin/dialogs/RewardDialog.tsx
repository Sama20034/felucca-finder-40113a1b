import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward?: any;
  onSuccess: () => void;
}

const RewardDialog = ({ open, onOpenChange, reward, onSuccess }: RewardDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    reward_type: 'discount' as 'discount' | 'free_shipping' | 'free_product',
    points_required: '',
    discount_value: '',
    free_product_id: '',
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (reward) {
      setFormData({
        name_ar: reward.name_ar || '',
        name_en: reward.name_en || '',
        description_ar: reward.description_ar || '',
        description_en: reward.description_en || '',
        reward_type: reward.reward_type || 'discount',
        points_required: reward.points_required?.toString() || '',
        discount_value: reward.discount_value?.toString() || '',
        free_product_id: reward.free_product_id || '',
        is_active: reward.is_active ?? true,
      });
    } else {
      setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        reward_type: 'discount',
        points_required: '',
        discount_value: '',
        free_product_id: '',
        is_active: true,
      });
    }
  }, [reward, open]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_ar')
        .eq('is_active', true)
        .order('name_ar');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rewardData = {
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        reward_type: formData.reward_type,
        points_required: parseInt(formData.points_required),
        discount_value: formData.reward_type === 'discount' ? parseFloat(formData.discount_value) : null,
        free_product_id: formData.reward_type === 'free_product' ? formData.free_product_id : null,
        is_active: formData.is_active,
      };

      let error;
      if (reward) {
        ({ error } = await supabase
          .from('loyalty_rewards')
          .update(rewardData)
          .eq('id', reward.id));
      } else {
        ({ error } = await supabase
          .from('loyalty_rewards')
          .insert([rewardData]));
      }

      if (error) throw error;

      toast({
        title: 'نجاح',
        description: reward ? 'تم تحديث المكافأة بنجاح' : 'تم إضافة المكافأة بنجاح',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reward:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ المكافأة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reward ? 'تعديل مكافأة' : 'إضافة مكافأة جديدة'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar">الاسم بالعربية *</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف بالعربية</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reward_type">نوع المكافأة *</Label>
              <Select
                value={formData.reward_type}
                onValueChange={(value: any) => setFormData({ ...formData, reward_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">خصم</SelectItem>
                  <SelectItem value="free_shipping">شحن مجاني</SelectItem>
                  <SelectItem value="free_product">منتج مجاني</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points_required">النقاط المطلوبة *</Label>
              <Input
                id="points_required"
                type="number"
                value={formData.points_required}
                onChange={(e) => setFormData({ ...formData, points_required: e.target.value })}
                required
              />
            </div>
          </div>

          {formData.reward_type === 'discount' && (
            <div className="space-y-2">
              <Label htmlFor="discount_value">قيمة الخصم (ج.م) *</Label>
              <Input
                id="discount_value"
                type="number"
                step="0.01"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                required={formData.reward_type === 'discount'}
              />
            </div>
          )}

          {formData.reward_type === 'free_product' && (
            <div className="space-y-2">
              <Label htmlFor="free_product_id">المنتج المجاني *</Label>
              <Select
                value={formData.free_product_id}
                onValueChange={(value) => setFormData({ ...formData, free_product_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">المكافأة نشطة</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : reward ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDialog;