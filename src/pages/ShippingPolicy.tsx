import { Truck, MapPin, Clock, Package } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Truck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              سياسة الشحن والتوصيل
            </h1>
            <p className="text-primary-foreground/90">
              نوصل لك في كل مكان في مصر
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-8">
              <p className="text-muted-foreground leading-relaxed">
                نحرص في متجر النيل على توصيل طلباتك بأسرع وقت ممكن وبأفضل حالة. نغطي جميع محافظات مصر 
                بخدمة توصيل موثوقة وسريعة.
              </p>
            </div>

            {/* Shipping Coverage */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    نطاق التغطية
                  </h2>
                </div>
              </div>
              <div className="mr-16">
                <p className="text-muted-foreground mb-4">
                  نوفر خدمة التوصيل لجميع محافظات جمهورية مصر العربية
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">القاهرة والجيزة</h3>
                    <p className="text-sm text-muted-foreground">داخل القاهرة الكبرى</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">الإسكندرية</h3>
                    <p className="text-sm text-muted-foreground">جميع مناطق الإسكندرية</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">الدلتا</h3>
                    <p className="text-sm text-muted-foreground">جميع محافظات الدلتا</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">الصعيد</h3>
                    <p className="text-sm text-muted-foreground">جميع محافظات الصعيد</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    مدة التوصيل
                  </h2>
                </div>
              </div>
              <div className="mr-16 space-y-4">
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-foreground mb-1">القاهرة والجيزة</h3>
                  <p className="text-sm text-muted-foreground">من 2-3 أيام عمل</p>
                </div>
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-foreground mb-1">باقي المحافظات</h3>
                  <p className="text-sm text-muted-foreground">من 3-5 أيام عمل</p>
                </div>
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-foreground mb-1">المناطق النائية</h3>
                  <p className="text-sm text-muted-foreground">من 5-7 أيام عمل</p>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * مدة التوصيل تبدأ من تاريخ تأكيد الطلب وتوافر المنتج
                </p>
              </div>
            </div>

            {/* Shipping Costs */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    تكاليف الشحن
                  </h2>
                </div>
              </div>
              <div className="mr-16">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary/5">
                      <tr>
                        <th className="text-right p-3 text-foreground font-semibold">المنطقة</th>
                        <th className="text-right p-3 text-foreground font-semibold">التكلفة</th>
                        <th className="text-right p-3 text-foreground font-semibold">الشحن المجاني</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="p-3">القاهرة والجيزة</td>
                        <td className="p-3">50 جنيه</td>
                        <td className="p-3">للطلبات أكثر من 500 جنيه</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3">الإسكندرية</td>
                        <td className="p-3">60 جنيه</td>
                        <td className="p-3">للطلبات أكثر من 600 جنيه</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3">باقي المحافظات</td>
                        <td className="p-3">70 جنيه</td>
                        <td className="p-3">للطلبات أكثر من 700 جنيه</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tracking */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                تتبع الطلب
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  بمجرد شحن طلبك، سنرسل لك رسالة نصية وبريد إلكتروني يحتويان على:
                </p>
                <ul className="space-y-2 mr-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>رقم الشحنة للتتبع</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>رابط مباشر لتتبع موقع الشحنة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>الوقت المتوقع للتوصيل</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                ملاحظات هامة
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>يجب التأكد من صحة العنوان ورقم الهاتف عند الطلب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>يتم التواصل معك قبل التوصيل بـ 24 ساعة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>يجب فحص المنتج عند الاستلام وقبل الدفع</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>في حالة عدم التواجد، سيتم المحاولة مرة أخرى</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>الأعياد والعطلات الرسمية قد تؤثر على مدة التوصيل</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                لأي استفسارات عن الشحن
              </h2>
              <p className="text-muted-foreground mb-4">
                فريق خدمة العملاء جاهز لمساعدتك:
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

export default ShippingPolicy;
