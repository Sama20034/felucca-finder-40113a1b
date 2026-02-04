import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Heart, Settings } from 'lucide-react';

interface Profile {
  full_name: string | null;
  phone: string | null;
  address: string | null;
}

const MyAccount = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL ? 'تم تحديث بياناتك بنجاح' : 'Your profile has been updated',
      });

      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء التحديث' : 'Error updating profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{isRTL ? 'حسابي' : 'My Account'}</h1>
            <p className="text-muted-foreground">{isRTL ? 'إدارة بيانات حسابك' : 'Manage your account information'}</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="gap-2">
                <Settings className="w-4 h-4" />
                {isRTL ? 'الملف الشخصي' : 'Profile'}
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="w-4 h-4" />
                {isRTL ? 'المفضلة' : 'Wishlist'}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {isRTL ? 'معلوماتي الشخصية' : 'Personal Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{isRTL ? 'العنوان' : 'Address'}</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    {isRTL ? 'قائمة المفضلة' : 'Wishlist'} ({wishlistItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{isRTL ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/shop')}
                      >
                        {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-primary font-bold">{item.price}</p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-destructive mt-2"
                            >
                              {isRTL ? 'إزالة' : 'Remove'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
