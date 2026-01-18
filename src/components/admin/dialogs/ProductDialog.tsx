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
import ImageUpload from '@/components/admin/ImageUpload';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  onSuccess: () => void;
}

interface ColorOption {
  name: string;
  name_ar: string;
  hex: string;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '38', '40', '42', '44', '46', '48'];

const PRESET_COLORS: ColorOption[] = [
  { name: 'Black', name_ar: 'أسود', hex: '#000000' },
  { name: 'White', name_ar: 'أبيض', hex: '#FFFFFF' },
  { name: 'Red', name_ar: 'أحمر', hex: '#EF4444' },
  { name: 'Blue', name_ar: 'أزرق', hex: '#3B82F6' },
  { name: 'Green', name_ar: 'أخضر', hex: '#22C55E' },
  { name: 'Yellow', name_ar: 'أصفر', hex: '#EAB308' },
  { name: 'Pink', name_ar: 'وردي', hex: '#EC4899' },
  { name: 'Purple', name_ar: 'بنفسجي', hex: '#A855F7' },
  { name: 'Orange', name_ar: 'برتقالي', hex: '#F97316' },
  { name: 'Gray', name_ar: 'رمادي', hex: '#6B7280' },
  { name: 'Brown', name_ar: 'بني', hex: '#92400E' },
  { name: 'Navy', name_ar: 'كحلي', hex: '#1E3A5F' },
  { name: 'Beige', name_ar: 'بيج', hex: '#D4C4B0' },
];

const ProductDialog = ({ open, onOpenChange, product, onSuccess }: ProductDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: '',
    original_price: '',
    category_id: '',
    stock_quantity: '',
    image_url: '',
    images: [] as string[],
    is_active: true,
    is_featured: false,
    show_in_deals: false,
    is_returnable: true,
    badge: '',
    loyalty_points: '',
    sku: '',
    length: '',
    length_ar: '',
    material: '',
    material_ar: '',
    sizes: [] as string[],
    colors: [] as ColorOption[],
    size_guide_image: '',
    related_products: [] as number[],
  });

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name_ar: product.name_ar || '',
        name_en: product.name || '',
        description_ar: product.description_ar || '',
        description_en: product.description || '',
        price: product.price?.toString() || '',
        original_price: product.original_price?.toString() || '',
        category_id: product.category_id?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        image_url: product.image_url || '',
        images: product.images || [],
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        show_in_deals: product.show_in_deals ?? false,
        is_returnable: product.is_returnable ?? true,
        badge: product.badge || '',
        loyalty_points: product.loyalty_points?.toString() || '',
        sku: product.sku || '',
        length: product.length || '',
        length_ar: product.length_ar || '',
        material: product.material || '',
        material_ar: product.material_ar || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        size_guide_image: product.size_guide_image || '',
        related_products: product.related_products || [],
      });
    } else {
      setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        price: '',
        original_price: '',
        category_id: '',
        stock_quantity: '',
        image_url: '',
        images: [],
        is_active: true,
        is_featured: false,
        show_in_deals: false,
        is_returnable: true,
        badge: '',
        loyalty_points: '',
        sku: '',
        length: '',
        length_ar: '',
        material: '',
        material_ar: '',
        sizes: [],
        colors: [],
        size_guide_image: '',
        related_products: [],
      });
    }
  }, [product, open]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name_ar');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_ar, name, image_url')
        .eq('is_active', true)
        .order('name_ar');

      if (error) throw error;
      setAllProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color: ColorOption) => {
    setFormData(prev => {
      const exists = prev.colors.some(c => c.hex === color.hex);
      return {
        ...prev,
        colors: exists
          ? prev.colors.filter(c => c.hex !== color.hex)
          : [...prev.colors, color]
      };
    });
  };

  const toggleRelatedProduct = (productId: number) => {
    setFormData(prev => ({
      ...prev,
      related_products: prev.related_products.includes(productId)
        ? prev.related_products.filter(id => id !== productId)
        : [...prev.related_products, productId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name_ar: formData.name_ar,
        name: formData.name_en,
        description_ar: formData.description_ar,
        description: formData.description_en,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: formData.image_url,
        images: formData.images.length > 0 ? formData.images : null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        show_in_deals: formData.show_in_deals,
        is_returnable: formData.is_returnable,
        badge: formData.badge || null,
        loyalty_points: formData.loyalty_points ? parseInt(formData.loyalty_points) : null,
        sku: formData.sku || null,
        length: formData.length || null,
        length_ar: formData.length_ar || null,
        material: formData.material || null,
        material_ar: formData.material_ar || null,
        sizes: formData.sizes.length > 0 ? formData.sizes : null,
        colors: formData.colors.length > 0 ? formData.colors : null,
        size_guide_image: formData.size_guide_image || null,
        related_products: formData.related_products.length > 0 ? formData.related_products : null,
      };

      let error;
      if (product) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert([productData]));
      }

      if (error) throw error;

      toast({
        title: 'نجاح',
        description: product ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ المنتج',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'تعديل منتج' : 'إضافة منتج جديد'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
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

          {/* SKU & Length */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (رقم المنتج)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="ABC-123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">الطول (إنجليزي)</Label>
              <Select
                value={formData.length || "none"}
                onValueChange={(value) => setFormData({ ...formData, length: value === "none" ? "" : value, length_ar: value === "short" ? "قصير" : value === "long" ? "طويل" : value === "maxi" ? "ماكسي" : "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطول" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون</SelectItem>
                  <SelectItem value="short">Short (قصير)</SelectItem>
                  <SelectItem value="long">Long (طويل)</SelectItem>
                  <SelectItem value="maxi">Maxi (ماكسي)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length_ar">الطول (عربي)</Label>
              <Input
                id="length_ar"
                value={formData.length_ar}
                onChange={(e) => setFormData({ ...formData, length_ar: e.target.value })}
                disabled
                placeholder="يُملأ تلقائياً"
              />
            </div>
          </div>

          {/* Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">النوع (إنجليزي)</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Casual, Formal..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material_ar">النوع (عربي)</Label>
              <Input
                id="material_ar"
                value={formData.material_ar}
                onChange={(e) => setFormData({ ...formData, material_ar: e.target.value })}
                placeholder="كاجوال، رسمي..."
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف بالعربية</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>المقاسات المتاحة</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={formData.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            {formData.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.sizes.map(size => (
                  <Badge key={size} variant="secondary" className="gap-1">
                    {size}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSize(size)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>الألوان المتاحة</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => {
                const isSelected = formData.colors.some(c => c.hex === color.hex);
                return (
                  <button
                    key={color.hex}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => toggleColor(color)}
                    title={color.name_ar}
                  />
                );
              })}
            </div>
            {formData.colors.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.colors.map(color => (
                  <Badge key={color.hex} variant="secondary" className="gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                    {color.name_ar}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleColor(color)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">السعر (ج.م) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original_price">السعر الأصلي (ج.م)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
              />
            </div>
          </div>

          {/* Stock & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">الكمية المتاحة *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loyalty_points">نقاط الاستبدال</Label>
              <Input
                id="loyalty_points"
                type="number"
                value={formData.loyalty_points}
                onChange={(e) => setFormData({ ...formData, loyalty_points: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">الفئة</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Select
                value={formData.badge || "none"}
                onValueChange={(value) => setFormData({ ...formData, badge: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر Badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون</SelectItem>
                  <SelectItem value="الأكثر مبيعاً">الأكثر مبيعاً</SelectItem>
                  <SelectItem value="جديد">جديد</SelectItem>
                  <SelectItem value="عرض خاص">عرض خاص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Image */}
          <div className="space-y-2">
            <ImageUpload
              bucket="products"
              folder="product-images"
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              label="صورة المنتج الرئيسية"
            />
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <Label>صور إضافية للمنتج</Label>
            <div className="grid grid-cols-4 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`صورة ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {formData.images.length < 8 && (
                <ImageUpload
                  bucket="products"
                  folder="product-images"
                  currentImageUrl=""
                  onImageUploaded={(url) => setFormData({ ...formData, images: [...formData.images, url] })}
                  label=""
                  compact
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">يمكنك إضافة حتى 8 صور إضافية</p>
          </div>

          {/* Size Guide */}
          <div className="space-y-2">
            <ImageUpload
              bucket="products"
              folder="size-guides"
              currentImageUrl={formData.size_guide_image}
              onImageUploaded={(url) => setFormData({ ...formData, size_guide_image: url })}
              label="صورة دليل المقاسات"
            />
          </div>

          {/* Related Products */}
          <div className="space-y-2 border-t pt-4">
            <Label>المنتجات المتعلقة</Label>
            <p className="text-xs text-muted-foreground">اختر المنتجات التي تريد عرضها كمنتجات متعلقة</p>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-2">
              {allProducts
                .filter(p => p.id !== product?.id)
                .map((p) => (
                  <div 
                    key={p.id} 
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      formData.related_products.includes(p.id) 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => toggleRelatedProduct(p.id)}
                  >
                    <img 
                      src={p.image_url || '/placeholder.svg'} 
                      alt={p.name_ar}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm flex-1">{p.name_ar}</span>
                    {formData.related_products.includes(p.id) && (
                      <Badge variant="secondary" className="text-xs">مختار</Badge>
                    )}
                  </div>
                ))}
            </div>
            {formData.related_products.length > 0 && (
              <p className="text-xs text-muted-foreground">
                تم اختيار {formData.related_products.length} منتج
              </p>
            )}
          </div>

          {/* Display Settings */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground">إعدادات العرض</h4>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">المنتج نشط</Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">عرض في Bestseller (الأكثر مبيعاً)</Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="show_in_deals"
                checked={formData.show_in_deals}
                onCheckedChange={(checked) => setFormData({ ...formData, show_in_deals: checked })}
              />
              <Label htmlFor="show_in_deals">عرض في Best Deals (أفضل العروض)</Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_returnable"
                checked={formData.is_returnable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_returnable: checked })}
              />
              <Label htmlFor="is_returnable" className="flex items-center gap-2">
                قابل للاسترجاع
                {!formData.is_returnable && (
                  <span className="text-xs text-destructive">(لا يمكن استرجاعه)</span>
                )}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : product ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;