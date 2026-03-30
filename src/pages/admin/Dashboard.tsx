import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Package, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import AnnouncementManager from '@/components/admin/AnnouncementManager';
import ReviewsManager from '@/components/admin/ReviewsManager';

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
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
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
    loadShopifyProducts();
  }, []);

  const loadShopifyProducts = async () => {
    setLoadingProducts(true);
    try {
      const products = await fetchShopifyProducts(100);
      setShopifyProducts(products);
    } catch (error) {
      console.error('Error loading Shopify products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

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

  const handleProductSelect = (handle: string) => {
    const selectedProduct = shopifyProducts.find(p => p.node.handle === handle);
    setFormData({
      ...formData,
      shopify_handle: handle,
      product_title: selectedProduct?.node.title || ''
    });
  };

  const handleSave = async () => {
    if (!formData.shopify_handle.trim()) {
      toast({ title: 'خطأ', description: 'يرجى اختيار منتج', variant: 'destructive' });
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

  // Filter out products that already have details (when adding new)
  const availableProducts = editingItem 
    ? shopifyProducts 
    : shopifyProducts.filter(p => !productDetails.some(d => d.shopify_handle === p.node.handle));

  // Merge Shopify products with product_details
  const mergedProducts = shopifyProducts.map(sp => {
    const detail = productDetails.find(d => d.shopify_handle === sp.node.handle);
    return { shopifyProduct: sp, detail };
  });

  if (loading || loadingProducts) {
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
        {/* Announcement Bar Management */}
        <AnnouncementManager />
        
        {/* Reviews Management */}
        <ReviewsManager />

        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">إدارة بيانات المنتجات</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              منتجات Shopify ({shopifyProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mergedProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا توجد منتجات في Shopify.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصورة</TableHead>
                    <TableHead>اسم المنتج</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>حالة البيانات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mergedProducts.map(({ shopifyProduct, detail }) => {
                    const imgUrl = shopifyProduct.node.images.edges[0]?.node.url;
                    const price = shopifyProduct.node.priceRange.minVariantPrice;
                    return (
                      <TableRow key={shopifyProduct.node.id}>
                        <TableCell>
                          {imgUrl ? (
                            <img src={imgUrl} alt={shopifyProduct.node.title} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{shopifyProduct.node.title}</TableCell>
                        <TableCell>{parseFloat(price.amount).toFixed(0)} {price.currencyCode}</TableCell>
                        <TableCell>
                          {detail ? (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">تم إضافة البيانات</span>
                          ) : (
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">بدون بيانات</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              if (detail) {
                                handleEdit(detail);
                              } else {
                                setEditingItem(null);
                                setFormData({
                                  shopify_handle: shopifyProduct.node.handle,
                                  product_title: shopifyProduct.node.title,
                                  how_to_use: '',
                                  how_it_works: '',
                                  ingredients: ''
                                });
                                setDialogOpen(true);
                              }
                            }}
                          >
                            {detail ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {detail ? 'تعديل' : 'إضافة بيانات'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
              <Label>اختر المنتج *</Label>
              {loadingProducts ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">جاري تحميل المنتجات...</span>
                </div>
              ) : (
                <Select
                  value={formData.shopify_handle}
                  onValueChange={handleProductSelect}
                  disabled={!!editingItem}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="اختر منتج من Shopify" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50 max-h-[300px]">
                    {availableProducts.map((product) => (
                      <SelectItem 
                        key={product.node.id} 
                        value={product.node.handle}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {product.node.images.edges[0] && (
                            <img 
                              src={product.node.images.edges[0].node.url} 
                              alt={product.node.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <span>{product.node.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {availableProducts.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        لا توجد منتجات متاحة
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
              {formData.shopify_handle && (
                <p className="text-xs text-muted-foreground mt-1">Handle: {formData.shopify_handle}</p>
              )}
            </div>
            <div>
              <Label>طريقة الاستخدام (How to Use)</Label>
              <Textarea
                value={formData.how_to_use}
                onChange={(e) => setFormData({ ...formData, how_to_use: e.target.value })}
                rows={4}
                placeholder="اكتب طريقة استخدام المنتج..."
              />
            </div>
            <div>
              <Label>كيف يعمل (How it Works)</Label>
              <Textarea
                value={formData.how_it_works}
                onChange={(e) => setFormData({ ...formData, how_it_works: e.target.value })}
                rows={4}
                placeholder="اكتب كيف يعمل المنتج..."
              />
            </div>
            <div>
              <Label>المكونات (Ingredients)</Label>
              <Textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={4}
                placeholder="اكتب مكونات المنتج..."
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
