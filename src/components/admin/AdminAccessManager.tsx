import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Loader2 } from 'lucide-react';

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
      const { error } = await supabase.rpc('grant_admin_by_email', { _email: newEmail.trim() });
      if (error) throw error;
      toast({ title: 'تم إضافة الأدمن بنجاح' });
      setNewEmail('');
      fetchAdmins();
    } catch (error: any) {
      const msg = error.message.includes('User not found')
        ? 'هذا الإيميل غير مسجل في الموقع'
        : error.message;
      toast({ title: 'خطأ', description: msg, variant: 'destructive' });
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

        <p className="text-xs text-muted-foreground">
          * يجب أن يكون المستخدم مسجل في الموقع أولاً حتى تتمكن من إضافته كأدمن
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminAccessManager;
