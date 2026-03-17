import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Megaphone, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  sort_order: number;
}

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setAnnouncements(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from("announcements").insert({
      message: newMessage.trim(),
      sort_order: announcements.length,
    });
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تمت الإضافة" });
      setNewMessage("");
      fetchAnnouncements();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (!error) {
      toast({ title: "تم الحذف" });
      fetchAnnouncements();
    }
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    await supabase.from("announcements").update({ is_active }).eq("id", id);
    fetchAnnouncements();
  };

  const handleUpdateMessage = async (id: string, message: string) => {
    await supabase.from("announcements").update({ message }).eq("id", id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          شريط الإعلانات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة إعلان جديدة..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} size="sm" className="gap-1 shrink-0">
            <Plus className="w-4 h-4" />
            إضافة
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-muted-foreground text-center py-4">جاري التحميل...</p>
        ) : announcements.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا توجد إعلانات. أضف إعلان ليظهر الشريط في الموقع.</p>
        ) : (
          <div className="space-y-2">
            {announcements.map((ann) => (
              <div key={ann.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/20">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  defaultValue={ann.message}
                  onBlur={(e) => handleUpdateMessage(ann.id, e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <Label htmlFor={`active-${ann.id}`} className="text-xs text-muted-foreground">
                    {ann.is_active ? "مفعّل" : "معطّل"}
                  </Label>
                  <Switch
                    id={`active-${ann.id}`}
                    checked={ann.is_active}
                    onCheckedChange={(checked) => handleToggle(ann.id, checked)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(ann.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementManager;
