import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Crown, Sparkles, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Invite/recovery state
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { user, isAdmin, signIn, signUp } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Detect invite/recovery token in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('type=invite') || hash.includes('type=recovery'))) {
      setIsSettingPassword(true);
    }
  }, []);

  // Redirect logged-in users (but not if setting password)
  useEffect(() => {
    if (user && !isSettingPassword) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [user, isAdmin, navigate, isSettingPassword]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'كلمة المرور غير متطابقة' : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: isRTL ? 'تم بنجاح!' : 'Success!',
        description: isRTL ? 'تم تعيين كلمة المرور. مرحباً بك!' : 'Password set successfully. Welcome!',
      });
      setIsSettingPassword(false);
      navigate(isAdmin ? '/admin' : '/');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName, phone);
    setLoading(false);
    if (!error) setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md card-luxury p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              {isSettingPassword ? <Lock className="w-8 h-8 text-primary" /> : <Crown className="w-8 h-8 text-primary" />}
            </div>
            <h1 className="font-serif text-3xl font-bold text-primary mb-2">
              {isSettingPassword
                ? (isRTL ? 'تعيين كلمة المرور' : 'Set Your Password')
                : (isRTL ? 'مرحباً بك' : 'Welcome')}
            </h1>
            <p className="text-muted-foreground">
              {isSettingPassword
                ? (isRTL ? 'اختار كلمة مرور جديدة لحسابك' : 'Choose a new password for your account')
                : (isRTL ? 'سجلي دخولك أو أنشئي حساب جديد' : 'Sign in or create a new account')}
            </p>
          </div>

          {isSettingPassword ? (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} dir="ltr" className="bg-secondary/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-card-foreground">{isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} dir="ltr" className="bg-secondary/30 border-border" />
              </div>
              <Button type="submit" className="w-full btn-gold rounded-full py-6" disabled={loading}>
                <Sparkles className="w-4 h-4 ml-2" />
                {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ كلمة المرور' : 'Save Password')}
              </Button>
            </form>
          ) : (
            <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-full p-1">
                <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {isRTL ? 'حساب جديد' : 'Sign Up'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" className="bg-secondary/30 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">{isRTL ? 'كلمة المرور' : 'Password'}</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" className="bg-secondary/30 border-border" />
                  </div>
                  <Button type="submit" className="w-full btn-gold rounded-full py-6" disabled={loading}>
                    <Sparkles className="w-4 h-4 ml-2" />
                    {loading ? (isRTL ? 'جاري الدخول...' : 'Signing in...') : (isRTL ? 'دخول' : 'Sign In')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                    <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-secondary/30 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required dir="ltr" className="bg-secondary/30 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" className="bg-secondary/30 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">{isRTL ? 'كلمة المرور' : 'Password'}</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} dir="ltr" className="bg-secondary/30 border-border" />
                  </div>
                  <Button type="submit" className="w-full btn-gold rounded-full py-6" disabled={loading}>
                    <Sparkles className="w-4 h-4 ml-2" />
                    {loading ? (isRTL ? 'جاري الإنشاء...' : 'Creating...') : (isRTL ? 'إنشاء حساب' : 'Create Account')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
