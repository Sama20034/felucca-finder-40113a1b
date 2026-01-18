import { CreditCard, Banknote, Wallet, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PaymentMethods = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-secondary to-secondary/80 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              طرق الدفع
            </h1>
            <p className="text-secondary-foreground/90">
              خيارات دفع متنوعة وآمنة لراحتك
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-8">
              <p className="text-muted-foreground leading-relaxed">
                نوفر لك في متجر النيل مجموعة متنوعة من طرق الدفع الآمنة والمريحة لتسهيل عملية الشراء. 
                اختر الطريقة التي تناسبك وتسوق بكل ثقة وأمان.
              </p>
            </div>

            {/* Cash on Delivery */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    الدفع عند الاستلام (Cash on Delivery)
                  </h2>
                  <span className="inline-block bg-green-500/10 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    الطريقة الأكثر شيوعاً
                  </span>
                </div>
              </div>
              <div className="mr-16 space-y-4">
                <p className="text-muted-foreground">
                  ادفع نقداً عند استلام طلبك من مندوب التوصيل. هذه الطريقة متاحة لجميع المحافظات.
                </p>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-3">مميزات الدفع عند الاستلام:</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>لا تحتاج لبطاقة بنكية</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>ادفع فقط بعد فحص المنتج والتأكد منه</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>آمن وموثوق 100%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>متاح لجميع المحافظات</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>ملحوظة:</strong> يرجى تجهيز المبلغ المطلوب (كاش) عند الاستلام
                  </p>
                </div>
              </div>
            </div>

            {/* Credit/Debit Cards */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    الدفع بالبطاقات البنكية
                  </h2>
                  <span className="inline-block bg-blue-500/10 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    قريباً
                  </span>
                </div>
              </div>
              <div className="mr-16 space-y-4">
                <p className="text-muted-foreground">
                  ادفع بأمان باستخدام بطاقات الائتمان والخصم المحلية والدولية.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4 text-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                      alt="Visa" 
                      className="h-8 mx-auto mb-2"
                    />
                    <p className="text-xs text-muted-foreground">بطاقات فيزا</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 text-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" 
                      alt="Mastercard" 
                      className="h-8 mx-auto mb-2"
                    />
                    <p className="text-xs text-muted-foreground">بطاقات ماستركارد</p>
                  </div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>قريباً:</strong> سيتم تفعيل الدفع الإلكتروني قريباً لمزيد من الراحة والأمان
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Wallets */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    المحافظ الإلكترونية
                  </h2>
                  <span className="inline-block bg-blue-500/10 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    قريباً
                  </span>
                </div>
              </div>
              <div className="mr-16 space-y-4">
                <p className="text-muted-foreground">
                  الدفع السريع والسهل عبر المحافظ الإلكترونية الشهيرة.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="border border-border rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold">VF</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Vodafone Cash</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-600 font-bold">IP</span>
                    </div>
                    <p className="text-xs text-muted-foreground">InstaPay</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold">FM</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Fawry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    الأمان والحماية
                  </h2>
                </div>
              </div>
              <div className="mr-16 space-y-3">
                <p className="text-muted-foreground">
                  نحرص على حماية معلوماتك المالية بأعلى معايير الأمان:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>جميع المعاملات محمية بتشفير SSL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>لا نحتفظ بمعلومات البطاقات البنكية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>نظام دفع آمن ومعتمد دولياً</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>حماية ضد الاحتيال والعمليات المشبوهة</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                أسئلة شائعة عن الدفع
              </h2>
              <div className="space-y-4">
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-foreground mb-2">هل يمكنني تغيير طريقة الدفع بعد الطلب؟</h3>
                  <p className="text-sm text-muted-foreground">
                    نعم، يمكنك التواصل مع خدمة العملاء قبل شحن الطلب لتغيير طريقة الدفع.
                  </p>
                </div>
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-foreground mb-2">هل الدفع عند الاستلام آمن؟</h3>
                  <p className="text-sm text-muted-foreground">
                    نعم، آمن تماماً. يمكنك فحص المنتج أولاً قبل الدفع.
                  </p>
                </div>
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-foreground mb-2">ماذا لو لم يكن معي المبلغ المطلوب؟</h3>
                  <p className="text-sm text-muted-foreground">
                    يرجى تجهيز المبلغ المطلوب قبل وصول المندوب، حيث لا يمكن إتمام التوصيل بدون الدفع.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                هل لديك أسئلة عن طرق الدفع؟
              </h2>
              <p className="text-muted-foreground mb-4">
                تواصل مع فريق خدمة العملاء:
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

export default PaymentMethods;
