import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, DollarSign, TrendingUp, Copy, Check, Share2, Gift, Target, Zap } from 'lucide-react';

const Affiliate = () => {
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAffiliate();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchAffiliate = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setAffiliate(data);
    } catch (error) {
      console.error('Error fetching affiliate:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'PW';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleJoinProgram = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    try {
      const referralCode = generateReferralCode();
      
      const { data, error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          referral_code: referralCode,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      setAffiliate(data);
      toast({
        title: isRTL ? 'تم التقديم بنجاح' : 'Application Submitted',
        description: isRTL ? 'سيتم مراجعة طلبك قريباً' : 'Your application will be reviewed soon',
      });
    } catch (error: any) {
      console.error('Error joining program:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${affiliate?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: isRTL ? 'تم النسخ' : 'Copied',
      description: isRTL ? 'تم نسخ رابط الإحالة' : 'Referral link copied to clipboard',
    });
  };

  const shareReferralLink = () => {
    const link = `${window.location.origin}?ref=${affiliate?.referral_code}`;
    const text = isRTL 
      ? `تسوقي من بينك ويش واحصلي على أفضل العروض! استخدمي كود الخصم: ${affiliate?.referral_code}`
      : `Shop at Pink Wish and get the best deals! Use referral code: ${affiliate?.referral_code}`;
    
    if (navigator.share) {
      navigator.share({ title: 'Pink Wish', text, url: link });
    } else {
      copyReferralLink();
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isRTL ? 'برنامج الشركاء' : 'Affiliate Program'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isRTL 
                ? 'انضمي لبرنامج الشركاء واحصلي على عمولة عن كل عملية شراء تتم من خلالك'
                : 'Join our affiliate program and earn commission on every purchase made through your referral'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Not Logged In */}
          {!user && (
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center">
                <CardTitle>{isRTL ? 'سجلي دخولك أولاً' : 'Sign In First'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'يجب تسجيل الدخول للانضمام لبرنامج الشركاء' : 'You need to sign in to join the affiliate program'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => navigate('/auth')} size="lg">
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Not Registered as Affiliate */}
          {user && !affiliate && (
            <>
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
                      <DollarSign className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{isRTL ? 'عمولة مجزية' : 'Generous Commission'}</h3>
                    <p className="text-muted-foreground">
                      {isRTL ? 'احصلي على 5% عمولة من كل عملية شراء' : 'Earn 5% commission on every purchase'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{isRTL ? 'تتبع سهل' : 'Easy Tracking'}</h3>
                    <p className="text-muted-foreground">
                      {isRTL ? 'تابعي إحالاتك وأرباحك بسهولة' : 'Track your referrals and earnings easily'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
                      <Zap className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{isRTL ? 'دفع سريع' : 'Fast Payouts'}</h3>
                    <p className="text-muted-foreground">
                      {isRTL ? 'استلمي أرباحك بسرعة وسهولة' : 'Receive your earnings quickly and easily'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Join Button */}
              <div className="text-center">
                <Button onClick={handleJoinProgram} size="lg" disabled={submitting} className="px-12">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isRTL ? 'جاري التسجيل...' : 'Joining...'}
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      {isRTL ? 'انضمي الآن' : 'Join Now'}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Registered Affiliate */}
          {user && affiliate && (
            <div className="max-w-4xl mx-auto">
              {/* Status Banner */}
              {affiliate.status === 'pending' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 text-center">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {isRTL ? 'طلبك قيد المراجعة. سيتم إعلامك عند الموافقة.' : 'Your application is under review. You will be notified upon approval.'}
                  </p>
                </div>
              )}

              {affiliate.status === 'rejected' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-center">
                  <p className="text-red-800 dark:text-red-200">
                    {isRTL ? 'تم رفض طلبك. تواصل معنا لمزيد من التفاصيل.' : 'Your application was rejected. Contact us for more details.'}
                  </p>
                </div>
              )}

              {affiliate.status === 'approved' && (
                <>
                  {/* Stats */}
                  <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{affiliate.total_earnings?.toFixed(2) || 0} {isRTL ? 'ج.م' : 'EGP'}</p>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الأرباح' : 'Total Earnings'}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{affiliate.pending_earnings?.toFixed(2) || 0} {isRTL ? 'ج.م' : 'EGP'}</p>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'أرباح معلقة' : 'Pending Earnings'}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{affiliate.paid_earnings?.toFixed(2) || 0} {isRTL ? 'ج.م' : 'EGP'}</p>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'تم صرفها' : 'Paid Out'}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{affiliate.total_referrals || 0}</p>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'الإحالات' : 'Referrals'}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Referral Link */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>{isRTL ? 'رابط الإحالة الخاص بك' : 'Your Referral Link'}</CardTitle>
                      <CardDescription>
                        {isRTL ? 'شاركي هذا الرابط واحصلي على عمولة' : 'Share this link and earn commission'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <span className="font-mono text-sm truncate flex-1">
                              {`${window.location.origin}?ref=${affiliate.referral_code}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={copyReferralLink} variant="outline">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="mr-2">{isRTL ? 'نسخ' : 'Copy'}</span>
                          </Button>
                          <Button onClick={shareReferralLink}>
                            <Share2 className="w-4 h-4" />
                            <span className="mr-2">{isRTL ? 'مشاركة' : 'Share'}</span>
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm">
                          <span className="font-bold">{isRTL ? 'كود الإحالة:' : 'Referral Code:'}</span>{' '}
                          <span className="font-mono text-primary">{affiliate.referral_code}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isRTL ? `نسبة العمولة: ${affiliate.commission_rate}%` : `Commission Rate: ${affiliate.commission_rate}%`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Affiliate;