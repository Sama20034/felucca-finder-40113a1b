import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Edit, Trash2, Settings } from "lucide-react";

interface ShippingZone {
  id: string;
  name: string;
  name_ar: string;
  type: string;
  parent_id: string | null;
  shipping_cost: number;
  free_shipping_threshold: number | null;
  is_active: boolean;
  display_order: number;
}

interface ShippingSettings {
  id: string;
  default_shipping_cost: number;
  free_shipping_threshold: number | null;
  is_zone_based: boolean;
}

const Shipping = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    type: "governorate",
    parent_id: "",
    shipping_cost: 50,
    free_shipping_threshold: 500,
    is_active: true,
  });

  const [settingsFormData, setSettingsFormData] = useState({
    default_shipping_cost: 50,
    free_shipping_threshold: 500,
    is_zone_based: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch shipping zones
      const { data: zonesData, error: zonesError } = await supabase
        .from("shipping_zones")
        .select("*")
        .order("display_order");

      if (zonesError) throw zonesError;
      setZones(zonesData || []);

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("shipping_settings")
        .select("*")
        .limit(1)
        .single();

      if (settingsError && settingsError.code !== "PGRST116") throw settingsError;
      
      if (settingsData) {
        setSettings(settingsData);
        setSettingsFormData({
          default_shipping_cost: settingsData.default_shipping_cost,
          free_shipping_threshold: settingsData.free_shipping_threshold || 500,
          is_zone_based: settingsData.is_zone_based,
        });
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (zone?: ShippingZone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name,
        name_ar: zone.name_ar,
        type: zone.type,
        parent_id: zone.parent_id || "",
        shipping_cost: zone.shipping_cost,
        free_shipping_threshold: zone.free_shipping_threshold || 500,
        is_active: zone.is_active,
      });
    } else {
      setEditingZone(null);
      setFormData({
        name: "",
        name_ar: "",
        type: "governorate",
        parent_id: "",
        shipping_cost: 50,
        free_shipping_threshold: 500,
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingZone) {
        const { error } = await supabase
          .from("shipping_zones")
          .update(formData)
          .eq("id", editingZone.id);

        if (error) throw error;

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث منطقة الشحن",
        });
      } else {
        const { error } = await supabase
          .from("shipping_zones")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة منطقة الشحن",
        });
      }

      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error saving zone:", error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المنطقة؟")) return;

    try {
      const { error } = await supabase
        .from("shipping_zones")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف منطقة الشحن",
      });

      fetchData();
    } catch (error: any) {
      console.error("Error deleting zone:", error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (settings) {
        const { error } = await supabase
          .from("shipping_settings")
          .update(settingsFormData)
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("shipping_settings")
          .insert([settingsFormData]);

        if (error) throw error;
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات الشحن",
      });

      setSettingsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const governorates = zones.filter((z) => z.type === "governorate");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة الشحن</h1>
            <p className="text-muted-foreground mt-1">
              إدارة مناطق الشحن وأسعار التوصيل
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSettingsDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <Settings className="w-4 h-4 ml-2" />
              الإعدادات
            </Button>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="w-4 h-4 ml-2" />
              إضافة منطقة
            </Button>
          </div>
        </div>

        {/* Current Settings */}
        <Card>
          <CardHeader>
            <CardTitle>الإعدادات الحالية</CardTitle>
            <CardDescription>الإعدادات العامة للشحن والتوصيل</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">تكلفة الشحن الافتراضية</p>
                <p className="text-2xl font-bold text-primary">
                  {settings?.default_shipping_cost || 50} ج.م
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الشحن المجاني فوق</p>
                <p className="text-2xl font-bold text-primary">
                  {settings?.free_shipping_threshold || "-"} ج.م
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">نظام التسعير</p>
                <p className="text-lg font-semibold">
                  {settings?.is_zone_based ? "حسب المنطقة" : "سعر ثابت"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zones Table */}
        <Card>
          <CardHeader>
            <CardTitle>مناطق الشحن</CardTitle>
            <CardDescription>
              إدارة المحافظات والمناطق وأسعار الشحن
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المنطقة</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>تكلفة الشحن</TableHead>
                      <TableHead>شحن مجاني فوق</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          لا توجد مناطق شحن
                        </TableCell>
                      </TableRow>
                    ) : (
                      zones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{zone.name_ar}</p>
                              <p className="text-xs text-muted-foreground">{zone.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              zone.type === "governorate"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary/10 text-secondary-foreground"
                            }`}>
                              {zone.type === "governorate" ? "محافظة" : "منطقة"}
                            </span>
                          </TableCell>
                          <TableCell>{zone.shipping_cost} ج.م</TableCell>
                          <TableCell>
                            {zone.free_shipping_threshold
                              ? `${zone.free_shipping_threshold} ج.م`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              zone.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {zone.is_active ? "نشط" : "غير نشط"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(zone)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(zone.id)}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Zone Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingZone ? "تعديل منطقة الشحن" : "إضافة منطقة شحن"}
            </DialogTitle>
            <DialogDescription>
              أدخل بيانات منطقة الشحن
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name_ar">الاسم بالعربية</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) =>
                  setFormData({ ...formData, name_ar: e.target.value })
                }
                placeholder="القاهرة"
              />
            </div>
            <div>
              <Label htmlFor="name">الاسم بالإنجليزية</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Cairo"
              />
            </div>
            <div>
              <Label htmlFor="type">النوع</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="governorate">محافظة</SelectItem>
                  <SelectItem value="area">منطقة فرعية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type === "area" && (
              <div>
                <Label htmlFor="parent_id">المحافظة التابعة لها</Label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parent_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    {governorates.map((gov) => (
                      <SelectItem key={gov.id} value={gov.id}>
                        {gov.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="shipping_cost">تكلفة الشحن (ج.م)</Label>
              <Input
                id="shipping_cost"
                type="number"
                value={formData.shipping_cost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shipping_cost: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="free_shipping_threshold">
                الشحن المجاني فوق (ج.م)
              </Label>
              <Input
                id="free_shipping_threshold"
                type="number"
                value={formData.free_shipping_threshold || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    free_shipping_threshold: parseFloat(e.target.value) || null,
                  })
                }
                placeholder="500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">نشط</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingZone ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إعدادات الشحن العامة</DialogTitle>
            <DialogDescription>
              قم بتعديل الإعدادات الأساسية للشحن
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="default_shipping_cost">
                تكلفة الشحن الافتراضية (ج.م)
              </Label>
              <Input
                id="default_shipping_cost"
                type="number"
                value={settingsFormData.default_shipping_cost}
                onChange={(e) =>
                  setSettingsFormData({
                    ...settingsFormData,
                    default_shipping_cost: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="free_shipping">الشحن المجاني فوق (ج.م)</Label>
              <Input
                id="free_shipping"
                type="number"
                value={settingsFormData.free_shipping_threshold || ""}
                onChange={(e) =>
                  setSettingsFormData({
                    ...settingsFormData,
                    free_shipping_threshold: parseFloat(e.target.value) || null,
                  })
                }
                placeholder="500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_zone_based"
                checked={settingsFormData.is_zone_based}
                onCheckedChange={(checked) =>
                  setSettingsFormData({
                    ...settingsFormData,
                    is_zone_based: checked,
                  })
                }
              />
              <Label htmlFor="is_zone_based">
                استخدام التسعير حسب المنطقة
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              عند التفعيل، سيتم حساب تكلفة الشحن حسب المنطقة. وإلا سيتم استخدام
              السعر الافتراضي.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettingsDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveSettings}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Shipping;
