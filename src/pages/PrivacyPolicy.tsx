import { Shield, Lock, Eye, UserCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              سياسة الخصوصية
            </h1>
            <p className="text-primary-foreground/90">
              نحن نحترم خصوصيتك ونحمي بياناتك الشخصية
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-8">
              <p className="text-muted-foreground leading-relaxed">
                في متجر النيل، نلتزم بحماية خصوصيتك وأمان معلوماتك الشخصية. توضح سياسة الخصوصية هذه 
                كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام موقعنا الإلكتروني.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {/* Section 1 */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      المعلومات التي نجمعها
                    </h2>
                  </div>
                </div>
                <ul className="space-y-3 text-muted-foreground mr-16">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>المعلومات الشخصية:</strong> الاسم، عنوان البريد الإلكتروني، رقم الهاتف، وعنوان التوصيل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>معلومات الطلب:</strong> تفاصيل المشتريات والمدفوعات</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>معلومات التصفح:</strong> عنوان IP، نوع المتصفح، وسلوك التصفح على الموقع</span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      كيف نستخدم معلوماتك
                    </h2>
                  </div>
                </div>
                <ul className="space-y-3 text-muted-foreground mr-16">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>معالجة وتنفيذ طلباتك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>التواصل معك بخصوص طلباتك والعروض الخاصة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>تحسين تجربة التسوق وخدمة العملاء</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>منع الاحتيال وضمان أمان الموقع</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      حماية معلوماتك
                    </h2>
                  </div>
                </div>
                <div className="space-y-3 text-muted-foreground mr-16">
                  <p>
                    نستخدم تدابير أمنية متقدمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>تشفير البيانات باستخدام SSL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>الوصول المحدود للموظفين المصرح لهم فقط</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>مراجعة وتحديث إجراءات الأمان بانتظام</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  مشاركة المعلومات
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  لن نقوم ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
                </p>
                <ul className="space-y-2 text-muted-foreground mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>مع شركات الشحن لتوصيل طلباتك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>مع معالجي الدفع لإتمام المعاملات</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>عند الامتثال للمتطلبات القانونية</span>
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  حقوقك
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  لديك الحق في:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>الوصول إلى معلوماتك الشخصية وتحديثها</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>طلب حذف بياناتك الشخصية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>الاعتراض على معالجة بياناتك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>إلغاء الاشتراك في الرسائل التسويقية</span>
                  </li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  تواصل معنا
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  إذا كان لديك أي أسئلة بخصوص سياسة الخصوصية، يرجى التواصل معنا:
                </p>
                <div className="space-y-2 text-foreground">
                  <p><strong>البريد الإلكتروني:</strong> k.360store@gmail.com</p>
                  <p><strong>الهاتف:</strong> <span dir="ltr">01001049502 - 01108383770</span></p>
                </div>
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

export default PrivacyPolicy;
