import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ProductDetail {
  id: string;
  shopify_handle: string;
  product_title: string | null;
  how_to_use: string | null;
  how_it_works: string | null;
  ingredients: string | null;
}

const Dashboard = () => {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductDetail | null>(null);
  const [formData, setFormData] = useState({
    shopify_handle: '',
    product_title: '',
    how_to_use: '',
    how_it_works: '',
    ingredients: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('product_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductDetails(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ shopify_handle: '', product_title: '', how_to_use: '', how_it_works: '', ingredients: '' });
    setDialogOpen(true);
  };

  const handleEdit = (item: ProductDetail) => {
    setEditingItem(item);
    setFormData({
      shopify_handle: item.shopify_handle,
      product_title: item.product_title || '',
      how_to_use: item.how_to_use || '',
      how_it_works: item.how_it_works || '',
      ingredients: item.ingredients || ''
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.shopify_handle.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال Handle المنتج', variant: 'destructive' });
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('product_details')
          .update({
            product_title: formData.product_title,
            how_to_use: formData.how_to_use,
            how_it_works: formData.how_it_works,
            ingredients: formData.ingredients
          })
          .eq('id', editingItem.id);
        if (error) throw error;
        toast({ title: 'تم التحديث', description: 'تم تحديث بيانات المنتج بنجاح' });
      } else {
        const { error } = await supabase
          .from('product_details')
          .insert({
            shopify_handle: formData.shopify_handle,
            product_title: formData.product_title,
            how_to_use: formData.how_to_use,
            how_it_works: formData.how_it_works,
            ingredients: formData.ingredients
          });
        if (error) throw error;
        toast({ title: 'تمت الإضافة', description: 'تم إضافة بيانات المنتج بنجاح' });
      }
      setDialogOpen(false);
      fetchProductDetails();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
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
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">إدارة بيانات المنتجات</h2>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة منتج جديد
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              بيانات منتجات Shopify
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productDetails.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا توجد بيانات منتجات. أضف بيانات لمنتجات Shopify.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Handle</TableHead>
                    <TableHead>اسم المنتج</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.shopify_handle}</TableCell>
                      <TableCell>{item.product_title || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل بيانات المنتج' : 'إضافة بيانات منتج'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Shopify Handle *</Label>
              <Input
                value={formData.shopify_handle}
                onChange={(e) => setFormData({ ...formData, shopify_handle: e.target.value })}
                disabled={!!editingItem}
                placeholder="product-handle"
                dir="ltr"
              />
            </div>
            <div>
              <Label>اسم المنتج</Label>
              <Input
                value={formData.product_title}
                onChange={(e) => setFormData({ ...formData, product_title: e.target.value })}
              />
            </div>
            <div>
              <Label>طريقة الاستخدام (How to Use)</Label>
              <Textarea
                value={formData.how_to_use}
                onChange={(e) => setFormData({ ...formData, how_to_use: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label>كيف يعمل (How it Works)</Label>
              <Textarea
                value={formData.how_it_works}
                onChange={(e) => setFormData({ ...formData, how_it_works: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label>المكونات (Ingredients)</Label>
              <Textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1 gap-2">
                <Save className="w-4 h-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Dashboard;
