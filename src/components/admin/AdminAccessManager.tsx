import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Loader2, Mail } from 'lucide-react';

interface AdminUser {
  user_id: string;
  email: string;
}

const AdminAccessManager = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.rpc('list_admin_emails');
      if (error) throw error;
      setAdmins(data || []);
    } catch (error: any) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setAdding(true);
    try {
      // Try granting admin first (if user exists)
      const { error } = await supabase.rpc('grant_admin_by_email', { _email: newEmail.trim() });
      if (error) throw error;
      toast({ title: 'تم إضافة الأدمن بنجاح' });
      setNewEmail('');
      fetchAdmins();
    } catch (error: any) {
      if (error.message.includes('User not found')) {
        // User not registered — offer to invite
        handleInvite();
      } else {
        toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      }
    } finally {
      setAdding(false);
    }
  };

  const handleInvite = async () => {
    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke('invite-admin', {
        body: { email: newEmail.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'تم إرسال الدعوة بنجاح ✉️',
        description: `تم إرسال رابط دعوة إلى ${newEmail}. سيقوم بتعيين كلمة المرور بنفسه.`,
      });
      setNewEmail('');
      fetchAdmins();
    } catch (error: any) {
      toast({ title: 'خطأ في إرسال الدعوة', description: error.message, variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const handleRevoke = async (email: string) => {
    try {
      const { error } = await supabase.rpc('revoke_admin_by_email', { _email: email });
      if (error) throw error;
      toast({ title: 'تم إزالة صلاحية الأدمن' });
      fetchAdmins();
    } catch (error: any) {
      const msg = error.message.includes('Cannot remove your own')
        ? 'لا يمكنك إزالة صلاحيتك أنت'
        : error.message;
      toast({ title: 'خطأ', description: msg, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          إدارة صلاحيات الأدمن
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="أدخل إيميل المستخدم..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1"
            dir="ltr"
          />
          <Button onClick={handleAdd} disabled={adding || !newEmail.trim()} className="gap-1">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            إضافة
          </Button>
          <Button onClick={handleInvite} disabled={adding || !newEmail.trim()} variant="outline" className="gap-1">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            دعوة
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا يوجد أدمنز</p>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => (
              <div key={admin.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium" dir="ltr">{admin.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevoke(admin.email)}
                  className="text-destructive hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>* <strong>إضافة:</strong> لو المستخدم مسجل بالفعل، يتم إعطاؤه صلاحية أدمن مباشرة</p>
          <p>* <strong>دعوة:</strong> لو المستخدم مش مسجل، يتم إرسال رابط دعوة على إيميله ويختار الباسورد بنفسه</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccessManager;
