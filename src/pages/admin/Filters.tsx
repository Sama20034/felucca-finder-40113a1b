import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FilterOption {
  id: string;
  type: string;
  value: string;
  name: string;
  name_ar: string;
  display_order: number;
  is_active: boolean;
}

interface FilterSetting {
  id: string;
  filter_key: string;
  name: string;
  name_ar: string;
  display_order: number;
  is_active: boolean;
}

const Filters = () => {
  const [sizes, setSizes] = useState<FilterOption[]>([]);
  const [colors, setColors] = useState<FilterOption[]>([]);
  const [filterSettings, setFilterSettings] = useState<FilterSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<FilterOption | null>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "sizes" | "colors">("settings");

  // Form state
  const [formValue, setFormValue] = useState("");
  const [formName, setFormName] = useState("");
  const [formNameAr, setFormNameAr] = useState("");
  const [formOrder, setFormOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    fetchFilters();
    fetchFilterSettings();
  }, []);

  const fetchFilters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("filter_options")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("حدث خطأ في تحميل الفلاتر");
      console.error(error);
    } else if (data) {
      setSizes(data.filter((f) => f.type === "size"));
      setColors(data.filter((f) => f.type === "color"));
    }
    setLoading(false);
  };

  const fetchFilterSettings = async () => {
    const { data, error } = await supabase
      .from("filter_settings")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error(error);
    } else if (data) {
      setFilterSettings(data);
    }
  };

  const openAddDialog = () => {
    setEditingOption(null);
    const currentList = activeTab === "sizes" ? sizes : colors;
    const maxOrder = currentList.reduce((max, opt) => Math.max(max, opt.display_order), 0);
    
    setFormValue("");
    setFormName("");
    setFormNameAr("");
    setFormOrder(maxOrder + 1);
    setFormActive(true);
    setDialogOpen(true);
  };

  const openEditDialog = (option: FilterOption) => {
    setEditingOption(option);
    setFormValue(option.value);
    setFormName(option.name);
    setFormNameAr(option.name_ar);
    setFormOrder(option.display_order);
    setFormActive(option.is_active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formValue.trim() || !formName.trim() || !formNameAr.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const type = activeTab === "sizes" ? "size" : "color";

    if (editingOption) {
      const { error } = await supabase
        .from("filter_options")
        .update({
          value: formValue,
          name: formName,
          name_ar: formNameAr,
          display_order: formOrder,
          is_active: formActive,
        })
        .eq("id", editingOption.id);

      if (error) {
        toast.error("حدث خطأ في التحديث");
        console.error(error);
      } else {
        toast.success("تم التحديث بنجاح");
        setDialogOpen(false);
        fetchFilters();
      }
    } else {
      const { error } = await supabase.from("filter_options").insert({
        type,
        value: formValue,
        name: formName,
        name_ar: formNameAr,
        display_order: formOrder,
        is_active: formActive,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("هذه القيمة موجودة بالفعل");
        } else {
          toast.error("حدث خطأ في الإضافة");
          console.error(error);
        }
      } else {
        toast.success("تمت الإضافة بنجاح");
        setDialogOpen(false);
        fetchFilters();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("filter_options").delete().eq("id", id);

    if (error) {
      toast.error("حدث خطأ في الحذف");
      console.error(error);
    } else {
      toast.success("تم الحذف بنجاح");
      fetchFilters();
    }
  };

  const toggleActive = async (option: FilterOption) => {
    const { error } = await supabase
      .from("filter_options")
      .update({ is_active: !option.is_active })
      .eq("id", option.id);

    if (error) {
      toast.error("حدث خطأ");
    } else {
      fetchFilters();
    }
  };

  const toggleFilterSetting = async (setting: FilterSetting) => {
    const { error } = await supabase
      .from("filter_settings")
      .update({ is_active: !setting.is_active })
      .eq("id", setting.id);

    if (error) {
      toast.error("حدث خطأ");
    } else {
      fetchFilterSettings();
    }
  };

  const moveFilterSetting = async (setting: FilterSetting, direction: "up" | "down") => {
    const currentIndex = filterSettings.findIndex((s) => s.id === setting.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= filterSettings.length) return;

    const swapSetting = filterSettings[swapIndex];

    // Swap display_order
    await Promise.all([
      supabase
        .from("filter_settings")
        .update({ display_order: swapSetting.display_order })
        .eq("id", setting.id),
      supabase
        .from("filter_settings")
        .update({ display_order: setting.display_order })
        .eq("id", swapSetting.id),
    ]);

    fetchFilterSettings();
  };

  const renderTable = (options: FilterOption[], isColor: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">الترتيب</TableHead>
          {isColor && <TableHead className="w-16">اللون</TableHead>}
          <TableHead>القيمة</TableHead>
          <TableHead>الاسم (EN)</TableHead>
          <TableHead>الاسم (AR)</TableHead>
          <TableHead className="w-20">الحالة</TableHead>
          <TableHead className="w-24">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {options.map((option) => (
          <TableRow key={option.id}>
            <TableCell className="text-muted-foreground">{option.display_order}</TableCell>
            {isColor && (
              <TableCell>
                <div
                  className="w-8 h-8 rounded-full border border-border"
                  style={{ backgroundColor: option.value }}
                />
              </TableCell>
            )}
            <TableCell className="font-mono">{option.value}</TableCell>
            <TableCell>{option.name}</TableCell>
            <TableCell>{option.name_ar}</TableCell>
            <TableCell>
              <Switch
                checked={option.is_active}
                onCheckedChange={() => toggleActive(option)}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setActiveTab(isColor ? "colors" : "sizes");
                    openEditDialog(option);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(option.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {options.length === 0 && (
          <TableRow>
            <TableCell colSpan={isColor ? 7 : 6} className="text-center text-muted-foreground py-8">
              لا توجد بيانات
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">إدارة الفلاتر</h1>
            <p className="text-muted-foreground">تحكم في الفلاتر المتاحة في صفحة المتجر وترتيبها</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "settings" | "sizes" | "colors")}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="settings">إعدادات الفلاتر</TabsTrigger>
              <TabsTrigger value="sizes">المقاسات ({sizes.length})</TabsTrigger>
              <TabsTrigger value="colors">الألوان ({colors.length})</TabsTrigger>
            </TabsList>
            {(activeTab === "sizes" || activeTab === "colors") && (
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة {activeTab === "sizes" ? "مقاس" : "لون"}
              </Button>
            )}
          </div>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>أنواع الفلاتر</CardTitle>
                <CardDescription>تحكم في الفلاتر التي تظهر في صفحة المتجر وترتيبها</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">الترتيب</TableHead>
                      <TableHead>الاسم (EN)</TableHead>
                      <TableHead>الاسم (AR)</TableHead>
                      <TableHead className="w-20">نشط</TableHead>
                      <TableHead className="w-24">تحريك</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterSettings.map((setting, index) => (
                      <TableRow key={setting.id}>
                        <TableCell className="text-muted-foreground">{setting.display_order}</TableCell>
                        <TableCell>{setting.name}</TableCell>
                        <TableCell>{setting.name_ar}</TableCell>
                        <TableCell>
                          <Switch
                            checked={setting.is_active}
                            onCheckedChange={() => toggleFilterSetting(setting)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveFilterSetting(setting, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveFilterSetting(setting, "down")}
                              disabled={index === filterSettings.length - 1}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>المقاسات</CardTitle>
                <CardDescription>المقاسات التي تظهر كخيارات فلترة في صفحة المتجر</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
                ) : (
                  renderTable(sizes, false)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>الألوان</CardTitle>
                <CardDescription>الألوان التي تظهر كخيارات فلترة في صفحة المتجر</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
                ) : (
                  renderTable(colors, true)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOption ? "تعديل" : "إضافة"} {activeTab === "sizes" ? "مقاس" : "لون"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value">
                {activeTab === "colors" ? "كود اللون (Hex)" : "القيمة"}
              </Label>
              {activeTab === "colors" ? (
                <div className="flex gap-2">
                  <Input
                    id="value"
                    type="color"
                    value={formValue || "#000000"}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono"
                  />
                </div>
              ) : (
                <Input
                  id="value"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="مثال: XL"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم (English)</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">الاسم (العربية)</Label>
                <Input
                  id="nameAr"
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  placeholder="أسود"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">ترتيب العرض</Label>
              <Input
                id="order"
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch id="active" checked={formActive} onCheckedChange={setFormActive} />
              <Label htmlFor="active">نشط (يظهر في الفلاتر)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {editingOption ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Filters;
