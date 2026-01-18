import { RotateCcw, Package, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-secondary to-secondary/80 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              سياسة الاسترجاع والاستبدال
            </h1>
            <p className="text-secondary-foreground/90">
              نحرص على رضاك التام عن منتجاتنا
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-8">
              <p className="text-muted-foreground leading-relaxed">
                في متجر النيل، نسعى لتوفير أفضل تجربة تسوق لعملائنا. إذا لم تكن راضياً تماماً عن مشترياتك، 
                نوفر لك سياسة استرجاع واستبدال مرنة وفقاً للشروط التالية.
              </p>
            </div>

            {/* Return Period */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    مدة الاسترجاع
                  </h2>
                </div>
              </div>
              <div className="mr-16 space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">7 أيام</strong> من تاريخ استلام المنتج لاسترجاعه أو استبداله
                </p>
                <p className="text-sm">
                  * يجب أن يكون هناك عيب صناعي أو تلف في المنتج لقبول الاسترجاع
                </p>
                <p className="text-sm">
                  * يجب أن يكون المنتج في حالته الأصلية مع جميع الملحقات والتغليف الأصلي
                </p>
              </div>
            </div>

            {/* Accepted Returns */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    حالات قبول الاسترجاع
                  </h2>
                </div>
              </div>
              <ul className="space-y-3 text-muted-foreground mr-16">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>المنتج به عيب صناعي أو تلف</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>استلام منتج مختلف عن المطلوب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>عدم مطابقة المنتج للمواصفات المعلنة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>المنتج لم يُستخدم ولا يزال في عبوته الأصلية</span>
                </li>
              </ul>
            </div>

            {/* Not Accepted Returns */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    حالات رفض الاسترجاع
                  </h2>
                </div>
              </div>
              <ul className="space-y-3 text-muted-foreground mr-16">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>المنتجات التي تم استخدامها أو تركيبها</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>المنتجات المخصصة أو المصنوعة حسب الطلب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>المنتجات التي فُقدت أجزاء منها أو تلفت تغليفها</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>المنتجات المعروضة بخصومات نهائية (Final Sale)</span>
                </li>
              </ul>
            </div>

            {/* Return Process */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                خطوات الاسترجاع
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">تواصل معنا</h3>
                    <p className="text-sm text-muted-foreground">
                      اتصل بخدمة العملاء على <span dir="ltr">01001049502</span> أو أرسل بريد إلكتروني
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">املأ نموذج الاسترجاع</h3>
                    <p className="text-sm text-muted-foreground">
                      قدم رقم الطلب وسبب الاسترجاع مع صور للمنتج إن أمكن
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">انتظر الموافقة</h3>
                    <p className="text-sm text-muted-foreground">
                      سيتم مراجعة طلبك خلال 24-48 ساعة
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">إعادة الشحن</h3>
                    <p className="text-sm text-muted-foreground">
                      سيتم جدولة موعد لاستلام المنتج من عنوانك
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">استرداد المبلغ</h3>
                    <p className="text-sm text-muted-foreground">
                      سيتم استرداد المبلغ خلال 7-14 يوم عمل بعد استلام المنتج
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Information */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                معلومات الاسترداد
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>يتم استرداد المبلغ بنفس طريقة الدفع المستخدمة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>رسوم الشحن غير قابلة للاسترداد إلا في حالة العيوب الصناعية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>في حالة الاستبدال، نتحمل تكاليف الشحن</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                تواصل مع خدمة العملاء
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                لأي استفسارات بخصوص الاسترجاع والاستبدال:
              </p>
              <div className="space-y-2 text-foreground">
                <p><strong>الهاتف:</strong> <span dir="ltr">01001049502 - 01108383770</span></p>
                <p><strong>البريد الإلكتروني:</strong> k.360store@gmail.com</p>
                <p><strong>ساعات العمل:</strong> من 10 صباحاً - 10 مساءً</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center mt-8 text-sm text-muted-foreground">
              آخر تحديث: نوفمبر 2024
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;
