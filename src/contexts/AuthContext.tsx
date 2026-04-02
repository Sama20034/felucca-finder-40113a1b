import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  needsPasswordSetup: boolean;
  clearPasswordSetup: () => void;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const { toast } = useToast();

  const clearPasswordSetup = () => {
    setNeedsPasswordSetup(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      setSession(session);

      // Detect invite/recovery flow
      if (event === 'PASSWORD_RECOVERY') {
        setNeedsPasswordSetup(true);
      }

      // Detect invited user on SIGNED_IN (user has needs_password metadata)
      if (event === 'SIGNED_IN' && session?.user) {
        const meta = session.user.user_metadata;
        if (meta?.needs_password === true) {
          setNeedsPasswordSetup(true);
        }
      }

      if (session?.user) {
        setLoading(true);
        setUser(null);
        setIsAdmin(false);

        setTimeout(() => {
          checkAdminRole(session.user!.id)
            .catch(() => {})
            .finally(() => {
              setUser(session.user ?? null);
              setLoading(false);
            });
        }, 0);
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        // Check if user has needs_password metadata
        const meta = session.user.user_metadata;
        if (meta?.needs_password === true) {
          setNeedsPasswordSetup(true);
        }

        setLoading(true);
        setUser(null);
        setIsAdmin(false);

        checkAdminRole(session.user.id)
          .catch(() => {})
          .finally(() => {
            setUser(session.user ?? null);
            setLoading(false);
          });
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        if (error.message.includes('fetch')) {
          toast({ title: "خطأ في الاتصال", description: "السيرفر يعمل على HTTP وموقعك على HTTPS. اتصل بمدير السيرفر لتفعيل HTTPS", variant: "destructive" });
        } else if (error.message.includes('User already registered')) {
          toast({ title: "هذا الإيميل مسجل مسبقاً", description: "جربي تسجيل الدخول بدلاً من إنشاء حساب جديد", variant: "destructive" });
        } else {
          toast({ title: "خطأ في التسجيل", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "تم التسجيل بنجاح", description: "يمكنك الآن تسجيل الدخول" });
      }

      return { error };
    } catch (error: any) {
      if (error.message && error.message.includes('fetch')) {
        toast({ title: "خطأ في الاتصال بالسيرفر", description: "تأكد من أن السيرفر يعمل على HTTPS أو جرب من متصفح آخر", variant: "destructive" });
      } else {
        toast({ title: "خطأ", description: error.message || "حدث خطأ غير متوقع", variant: "destructive" });
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('fetch')) {
          toast({ title: "خطأ في الاتصال", description: "السيرفر يعمل على HTTP. يجب تفعيل HTTPS للاتصال الآمن", variant: "destructive" });
        } else if (error.message.includes('Email not confirmed')) {
          toast({ title: "يرجى تأكيد بريدك الإلكتروني", description: "تحقق من بريدك الإلكتروني وانقر على رابط التأكيد، أو اطلب من المدير تعطيل \"Confirm email\" من إعدادات Supabase", variant: "destructive", duration: 10000 });
        } else {
          toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "مرحباً بك!", description: "تم تسجيل الدخول بنجاح" });
      }

      return { error };
    } catch (error: any) {
      if (error.message && error.message.includes('fetch')) {
        toast({ title: "خطأ في الاتصال بالسيرفر", description: "السيرفر يعمل على HTTP، يجب استخدام HTTPS", variant: "destructive" });
      } else {
        toast({ title: "خطأ", description: error.message || "حدث خطأ غير متوقع", variant: "destructive" });
      }
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setNeedsPasswordSetup(false);
      toast({ title: "تم تسجيل الخروج", description: "نراك قريباً!" });
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, needsPasswordSetup, clearPasswordSetup, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
