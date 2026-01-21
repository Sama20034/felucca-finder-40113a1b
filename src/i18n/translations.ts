export type Language = 'en' | 'ar';

export const translations = {
  // Order Tracking
  trackOrder: { en: 'Track Order', ar: 'تتبع الطلب' },
  trackOrderDescription: { en: 'Enter your order number and phone to track your order', ar: 'أدخل رقم الطلب ورقم الهاتف لتتبع طلبك' },
  orderPending: { en: 'Pending', ar: 'قيد المراجعة' },
  orderProcessing: { en: 'Processing', ar: 'جاري التجهيز' },
  orderShipped: { en: 'Shipped', ar: 'جاري الشحن' },
  orderDelivered: { en: 'Delivered', ar: 'تم التوصيل' },
  orderCancelled: { en: 'Cancelled', ar: 'ملغي' },
  statusHistory: { en: 'Status History', ar: 'سجل التحديثات' },
  orderItems: { en: 'Order Items', ar: 'منتجات الطلب' },
  shippingAddress: { en: 'Shipping Address', ar: 'عنوان الشحن' },
  statusNote: { en: 'Status Note', ar: 'ملاحظة الحالة' },
  addNote: { en: 'Add Note (optional)', ar: 'إضافة ملاحظة (اختياري)' },
  phoneNumber: { en: 'Phone Number', ar: 'رقم الهاتف' },
  relatedProducts: { en: 'Related Products', ar: 'منتجات ذات صلة' },
  // Navigation
  home: { en: 'Home', ar: 'الرئيسية' },
  shop: { en: 'Shop', ar: 'المتجر' },
  categories: { en: 'Categories', ar: 'الفئات' },
  about: { en: 'About Us', ar: 'من نحن' },
  contact: { en: 'Contact', ar: 'تواصل معنا' },
  faq: { en: 'FAQ', ar: 'الأسئلة الشائعة' },
  
  // Header
  search: { en: 'Search...', ar: 'بحث...' },
  searchProducts: { en: 'Search products...', ar: 'ابحث عن منتجات...' },
  myAccount: { en: 'My Account', ar: 'حسابي' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  register: { en: 'Register', ar: 'إنشاء حساب' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  cart: { en: 'Cart', ar: 'السلة' },
  wishlist: { en: 'Wishlist', ar: 'المفضلة' },
  
  // Hero Section
  heroTitle: { en: 'Discover Your Style', ar: 'اكتشفي أناقتك' },
  heroSubtitle: { en: 'Explore our exclusive collection of fashion and accessories', ar: 'تصفحي مجموعتنا الحصرية من الأزياء والإكسسوارات' },
  shopNow: { en: 'Shop Now', ar: 'تسوقي الآن' },
  viewCategories: { en: 'View Categories', ar: 'عرض الفئات' },
  
  // Categories Section
  shopByCategory: { en: 'Shop by Category', ar: 'تسوقي حسب الفئة' },
  viewAll: { en: 'View All', ar: 'عرض الكل' },
  moreCategories: { en: 'More Categories', ar: 'المزيد من الفئات' },
  
  // Products
  products: { en: 'Products', ar: 'المنتجات' },
  popularProducts: { en: 'Popular Products', ar: 'المنتجات الشائعة' },
  bestDeals: { en: 'Best Deals', ar: 'أفضل العروض' },
  newArrivals: { en: 'New Arrivals', ar: 'وصل حديثاً' },
  featuredProducts: { en: 'Featured Products', ar: 'منتجات مميزة' },
  addToCart: { en: 'Add to Cart', ar: 'أضف للسلة' },
  addedToCart: { en: 'Added to Cart', ar: 'تمت الإضافة للسلة' },
  addToWishlist: { en: 'Add to Wishlist', ar: 'أضف للمفضلة' },
  removeFromWishlist: { en: 'Remove from Wishlist', ar: 'إزالة من المفضلة' },
  outOfStock: { en: 'Out of Stock', ar: 'نفذت الكمية' },
  inStock: { en: 'In Stock', ar: 'متوفر' },
  quickView: { en: 'Quick View', ar: 'عرض سريع' },
  selectSize: { en: 'Select Size', ar: 'اختر المقاس' },
  selectColor: { en: 'Select Color', ar: 'اختر اللون' },
  
  // Pricing
  egp: { en: 'EGP', ar: 'ج.م' },
  price: { en: 'Price', ar: 'السعر' },
  originalPrice: { en: 'Original Price', ar: 'السعر الأصلي' },
  discount: { en: 'Discount', ar: 'خصم' },
  save: { en: 'Save', ar: 'وفر' },
  points: { en: 'points', ar: 'نقطة' },
  
  // Banners
  newArrivalsTitle: { en: 'New Arrivals', ar: 'وصل حديثاً' },
  winterCollection: { en: 'Winter Collection', ar: 'تشكيلة الشتاء الجديدة' },
  saleTitle: { en: 'Sale', ar: 'تخفيضات' },
  upToOff: { en: 'Up to 70% OFF', ar: 'خصم حتى 70%' },
  topSellers: { en: 'Top Sellers', ar: 'المفضلة' },
  mostRequested: { en: 'Most Requested', ar: 'الأكثر طلباً' },
  
  // Cart
  yourCart: { en: 'Your Cart', ar: 'سلة التسوق' },
  cartEmpty: { en: 'Your cart is empty', ar: 'سلتك فارغة' },
  continueShopping: { en: 'Continue Shopping', ar: 'متابعة التسوق' },
  subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
  shipping: { en: 'Shipping', ar: 'الشحن' },
  total: { en: 'Total', ar: 'الإجمالي' },
  checkout: { en: 'Checkout', ar: 'إتمام الطلب' },
  removeItem: { en: 'Remove Item', ar: 'إزالة المنتج' },
  quantity: { en: 'Quantity', ar: 'الكمية' },
  
  // Checkout
  checkoutTitle: { en: 'Checkout', ar: 'إتمام الطلب' },
  shippingInfo: { en: 'Shipping Information', ar: 'معلومات الشحن' },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  address: { en: 'Address', ar: 'العنوان' },
  city: { en: 'City', ar: 'المدينة' },
  governorate: { en: 'Governorate', ar: 'المحافظة' },
  notes: { en: 'Notes', ar: 'ملاحظات' },
  orderNotes: { en: 'Order Notes (Optional)', ar: 'ملاحظات الطلب (اختياري)' },
  placeOrder: { en: 'Place Order', ar: 'تأكيد الطلب' },
  orderSummary: { en: 'Order Summary', ar: 'ملخص الطلب' },
  
  // Coupons
  couponCode: { en: 'Coupon Code', ar: 'كود الخصم' },
  applyCoupon: { en: 'Apply', ar: 'تطبيق' },
  couponApplied: { en: 'Coupon Applied', ar: 'تم تطبيق الكود' },
  invalidCoupon: { en: 'Invalid Coupon', ar: 'كود غير صالح' },
  
  // Auth
  signIn: { en: 'Sign In', ar: 'تسجيل الدخول' },
  signUp: { en: 'Sign Up', ar: 'إنشاء حساب' },
  password: { en: 'Password', ar: 'كلمة المرور' },
  confirmPassword: { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' },
  forgotPassword: { en: 'Forgot Password?', ar: 'نسيت كلمة المرور؟' },
  dontHaveAccount: { en: "Don't have an account?", ar: 'ليس لديك حساب؟' },
  alreadyHaveAccount: { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },
  
  // Account
  profile: { en: 'Profile', ar: 'الملف الشخصي' },
  myOrders: { en: 'My Orders', ar: 'طلباتي' },
  orderHistory: { en: 'Order History', ar: 'سجل الطلبات' },
  accountSettings: { en: 'Account Settings', ar: 'إعدادات الحساب' },
  manageAccountInfo: { en: 'Manage your personal information, orders and loyalty points', ar: 'إدارة معلوماتك الشخصية وطلباتك ونقاط الولاء' },
  availablePoints: { en: 'available points', ar: 'نقطة متاحة' },
  totalPurchases: { en: 'Total Purchases', ar: 'إجمالي المشتريات' },
  yourPurchaseValue: { en: 'your purchase value', ar: 'قيمة مشترياتك' },
  orders: { en: 'Orders', ar: 'الطلبات' },
  order: { en: 'order', ar: 'طلب' },
  product: { en: 'product', ar: 'منتج' },
  accountInfo: { en: 'Account Info', ar: 'معلومات الحساب' },
  wishlistTitle: { en: 'Wishlist', ar: 'قائمة الأمنيات' },
  pointsTitle: { en: 'Points', ar: 'النقاط' },
  personalInfo: { en: 'Personal Information', ar: 'معلوماتك الشخصية' },
  updatePersonalInfo: { en: 'Update your personal information and shipping address', ar: 'تحديث بياناتك الشخصية وعنوان الشحن' },
  saveChangesBtn: { en: 'Save Changes', ar: 'حفظ التغييرات' },
  saving: { en: 'Saving...', ar: 'جاري الحفظ...' },
  trackOrders: { en: 'Track your previous orders', ar: 'تتبع حالة طلباتك السابقة' },
  noOrdersYet: { en: 'No orders yet', ar: 'لا توجد طلبات حتى الآن' },
  orderLabel: { en: 'Order', ar: 'طلب' },
  yourFavorites: { en: 'Your favorite products', ar: 'المنتجات المفضلة لديك' },
  wishlistEmpty: { en: 'Wishlist is empty', ar: 'قائمة الأمنيات فارغة' },
  loyaltyPointsHistory: { en: 'Loyalty Points History', ar: 'سجل نقاط الولاء' },
  last10Transactions: { en: 'Last 10 transactions', ar: 'آخر 10 معاملات في نقاط الولاء' },
  noTransactionsYet: { en: 'No transactions yet', ar: 'لا توجد معاملات حتى الآن' },
  date: { en: 'Date', ar: 'التاريخ' },
  type: { en: 'Type', ar: 'النوع' },
  description: { en: 'Description', ar: 'الوصف' },
  earnPoints: { en: 'Earn Points', ar: 'اكتساب نقاط' },
  redeemPoints: { en: 'Redeem Points', ar: 'استبدال نقاط' },
  expirePoints: { en: 'Expire Points', ar: 'انتهاء صلاحية' },
  profileUpdated: { en: 'Profile updated successfully', ar: 'تم تحديث بياناتك بنجاح' },
  errorLoadingProfile: { en: 'Error loading profile', ar: 'حدث خطأ أثناء تحميل بيانات الحساب' },
  errorUpdatingProfile: { en: 'Error updating profile', ar: 'حدث خطأ أثناء تحديث البيانات' },
  enterFullName: { en: 'Enter your full name', ar: 'أدخل اسمك الكامل' },
  streetArea: { en: 'Street, Area', ar: 'الشارع، المنطقة' },
  confirmed: { en: 'Confirmed', ar: 'تم التأكيد' },
  loyaltyPoints: { en: 'Loyalty Points', ar: 'نقاط الولاء' },
  
  // Orders
  orderNumber: { en: 'Order Number', ar: 'رقم الطلب' },
  orderDate: { en: 'Order Date', ar: 'تاريخ الطلب' },
  orderStatus: { en: 'Status', ar: 'الحالة' },
  orderTotal: { en: 'Total', ar: 'الإجمالي' },
  orderDetails: { en: 'Order Details', ar: 'تفاصيل الطلب' },
  pending: { en: 'Pending', ar: 'قيد الانتظار' },
  processing: { en: 'Processing', ar: 'قيد المعالجة' },
  shipped: { en: 'Shipped', ar: 'تم الشحن' },
  delivered: { en: 'Delivered', ar: 'تم التوصيل' },
  cancelled: { en: 'Cancelled', ar: 'ملغي' },
  
  // Footer
  aboutUs: { en: 'About Us', ar: 'من نحن' },
  customerService: { en: 'Customer Service', ar: 'خدمة العملاء' },
  privacyPolicy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  returnPolicy: { en: 'Return Policy', ar: 'سياسة الإرجاع' },
  shippingPolicy: { en: 'Shipping Policy', ar: 'سياسة الشحن' },
  paymentMethods: { en: 'Payment Methods', ar: 'طرق الدفع' },
  followUs: { en: 'Follow Us', ar: 'تابعنا' },
  newsletter: { en: 'Newsletter', ar: 'النشرة البريدية' },
  subscribeNewsletter: { en: 'Subscribe to our newsletter', ar: 'اشترك في نشرتنا البريدية' },
  enterEmail: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' },
  subscribe: { en: 'Subscribe', ar: 'اشتراك' },
  allRightsReserved: { en: 'All Rights Reserved', ar: 'جميع الحقوق محفوظة' },
  
  // About Page
  aboutTitle: { en: 'About Pink Wish', ar: 'عن بينك ويش' },
  ourStory: { en: 'Our Story', ar: 'قصتنا' },
  ourMission: { en: 'Our Mission', ar: 'رسالتنا' },
  ourVision: { en: 'Our Vision', ar: 'رؤيتنا' },
  
  // Contact Page
  contactTitle: { en: 'Contact Us', ar: 'تواصل معنا' },
  sendMessage: { en: 'Send Message', ar: 'إرسال رسالة' },
  yourName: { en: 'Your Name', ar: 'اسمك' },
  yourEmail: { en: 'Your Email', ar: 'بريدك الإلكتروني' },
  subject: { en: 'Subject', ar: 'الموضوع' },
  message: { en: 'Message', ar: 'الرسالة' },
  
  // CTA Section
  ctaTitle: { en: 'Join Our Community', ar: 'انضمي لمجتمعنا' },
  ctaSubtitle: { en: 'Get exclusive offers and updates', ar: 'احصلي على عروض حصرية وتحديثات' },
  
  // General
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  error: { en: 'Error', ar: 'خطأ' },
  success: { en: 'Success', ar: 'نجاح' },
  saveChanges: { en: 'Save', ar: 'حفظ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  confirm: { en: 'Confirm', ar: 'تأكيد' },
  delete: { en: 'Delete', ar: 'حذف' },
  edit: { en: 'Edit', ar: 'تعديل' },
  view: { en: 'View', ar: 'عرض' },
  back: { en: 'Back', ar: 'رجوع' },
  next: { en: 'Next', ar: 'التالي' },
  previous: { en: 'Previous', ar: 'السابق' },
  page: { en: 'Page', ar: 'صفحة' },
  of: { en: 'of', ar: 'من' },
  noResults: { en: 'No results found', ar: 'لا توجد نتائج' },
  
  // Filters
  filters: { en: 'Filters', ar: 'الفلاتر' },
  sortBy: { en: 'Sort By', ar: 'ترتيب حسب' },
  priceHighToLow: { en: 'Price: High to Low', ar: 'السعر: الأعلى للأقل' },
  priceLowToHigh: { en: 'Price: Low to High', ar: 'السعر: الأقل للأعلى' },
  newest: { en: 'Newest', ar: 'الأحدث' },
  mostPopular: { en: 'Most Popular', ar: 'الأكثر شعبية' },
  allCategories: { en: 'All Categories', ar: 'كل الفئات' },
  sizes: { en: 'Sizes', ar: 'المقاسات' },
  colors: { en: 'Colors', ar: 'الألوان' },
  priceRange: { en: 'Price Range', ar: 'نطاق السعر' },
  brand: { en: 'Brand', ar: 'الماركة' },
  material: { en: 'Material', ar: 'الخامة' },
  clearFilters: { en: 'Clear Filters', ar: 'مسح الفلاتر' },
  sizeGuide: { en: 'Size Guide', ar: 'دليل المقاسات' },
  
  // Badges
  new: { en: 'New', ar: 'جديد' },
  sale: { en: 'Sale', ar: 'تخفيض' },
  hot: { en: 'Hot', ar: 'رائج' },
  bestseller: { en: 'Bestseller', ar: 'الأكثر مبيعاً' },
  
  // Messages
  itemAddedToCart: { en: 'Item added to cart', ar: 'تمت إضافة المنتج للسلة' },
  itemRemovedFromCart: { en: 'Item removed from cart', ar: 'تم إزالة المنتج من السلة' },
  itemAddedToWishlist: { en: 'Item added to wishlist', ar: 'تمت إضافة المنتج للمفضلة' },
  itemRemovedFromWishlist: { en: 'Item removed from wishlist', ar: 'تم إزالة المنتج من المفضلة' },
  orderPlacedSuccess: { en: 'Order placed successfully!', ar: 'تم تقديم الطلب بنجاح!' },
  thankYouForOrder: { en: 'Thank you for your order', ar: 'شكراً لطلبك' },
  
  // WhatsApp
  whatsappHelp: { en: 'Need help? Chat with us!', ar: 'تحتاج مساعدة؟ تواصل معنا!' },
  
  // Affiliate
  affiliateProgram: { en: 'Affiliate Program', ar: 'برنامج الشركاء' },
  referralCode: { en: 'Referral Code', ar: 'كود الإحالة' },
  applyReferral: { en: 'Apply', ar: 'تطبيق' },
  referralApplied: { en: 'Referral Applied', ar: 'تم تطبيق كود الإحالة' },
  invalidReferral: { en: 'Invalid referral code', ar: 'كود إحالة غير صالح' },
  joinAffiliateProgram: { en: 'Join Affiliate Program', ar: 'انضم لبرنامج الشركاء' },
  affiliateDashboard: { en: 'Affiliate Dashboard', ar: 'لوحة الشركاء' },
  yourReferralCode: { en: 'Your Referral Code', ar: 'كود الإحالة الخاص بك' },
  yourReferralLink: { en: 'Your Referral Link', ar: 'رابط الإحالة الخاص بك' },
  totalEarnings: { en: 'Total Earnings', ar: 'إجمالي الأرباح' },
  pendingEarnings: { en: 'Pending Earnings', ar: 'الأرباح المعلقة' },
  paidEarnings: { en: 'Paid Earnings', ar: 'الأرباح المدفوعة' },
  totalReferrals: { en: 'Total Referrals', ar: 'إجمالي الإحالات' },
  commissionRate: { en: 'Commission Rate', ar: 'نسبة العمولة' },
  affiliateStatus: { en: 'Status', ar: 'الحالة' },
  affiliatePending: { en: 'Under Review', ar: 'قيد المراجعة' },
  affiliateApproved: { en: 'Approved', ar: 'مفعّل' },
  affiliateRejected: { en: 'Rejected', ar: 'مرفوض' },
  notAffiliate: { en: 'You are not an affiliate yet', ar: 'لم تنضم لبرنامج الشركاء بعد' },
  joinNow: { en: 'Join Now', ar: 'انضم الآن' },
  copyCode: { en: 'Copy Code', ar: 'نسخ الكود' },
  copyLink: { en: 'Copy Link', ar: 'نسخ الرابط' },
  copied: { en: 'Copied!', ar: 'تم النسخ!' },
  
  // Returns
  returns: { en: 'Returns', ar: 'الاسترجاع' },
  returnRequest: { en: 'Return Request', ar: 'طلب استرجاع' },
  requestReturn: { en: 'Request Return', ar: 'طلب استرجاع' },
  returnReason: { en: 'Return Reason', ar: 'سبب الاسترجاع' },
  refundType: { en: 'Refund Type', ar: 'نوع الاسترداد' },
  refundAsMoney: { en: 'Cash Refund', ar: 'استرداد نقدي' },
  refundAsWallet: { en: 'Wallet Refund', ar: 'استرداد للمحفظة' },
  refundAsPoints: { en: 'Refund as Points', ar: 'استرداد كنقاط' },
  pointsBonus: { en: 'Points Bonus', ar: 'مكافأة النقاط' },
  returnPending: { en: 'Return Pending', ar: 'قيد المراجعة' },
  returnApproved: { en: 'Return Approved', ar: 'تمت الموافقة' },
  returnRejected: { en: 'Return Rejected', ar: 'تم الرفض' },
  returnCompleted: { en: 'Return Completed', ar: 'مكتمل' },
  noReturns: { en: 'No return requests', ar: 'لا توجد طلبات استرجاع' },
  returnSubmitted: { en: 'Return request submitted', ar: 'تم إرسال طلب الاسترجاع' },
  returnWindowExpired: { en: 'Return window expired', ar: 'انتهت فترة الاسترجاع' },
  returnsDisabled: { en: 'Returns are currently disabled', ar: 'نظام الاسترجاع غير مفعل حالياً' },
  returnAlreadyRequested: { en: 'Return already requested', ar: 'تم طلب استرجاع مسبقاً' },

  // Wallet
  wallet: { en: 'Wallet', ar: 'المحفظة' },
  walletBalance: { en: 'Wallet Balance', ar: 'رصيد المحفظة' },
  walletHistory: { en: 'Wallet Transactions', ar: 'سجل المحفظة' },
  walletCredit: { en: 'Credit', ar: 'إيداع' },
  walletDebit: { en: 'Debit', ar: 'خصم' },
  noWalletTransactions: { en: 'No wallet transactions yet', ar: 'لا توجد معاملات في المحفظة' },
  useWallet: { en: 'Use Wallet Balance', ar: 'استخدام رصيد المحفظة' },
  walletDeduction: { en: 'Wallet Deduction', ar: 'خصم المحفظة' },
  amount: { en: 'Amount', ar: 'المبلغ' },
  usePoints: { en: 'Use Loyalty Points', ar: 'استخدام نقاط الولاء' },
  pointsDeduction: { en: 'Points Deduction', ar: 'خصم النقاط' },
  paymentOptions: { en: 'Payment Options', ar: 'خيارات الدفع' },
  availableBalance: { en: 'Available Balance', ar: 'الرصيد المتاح' },
  pointsValue: { en: 'Points Value', ar: 'قيمة النقاط' },

  // Reviews
  reviews: { en: 'Reviews', ar: 'التقييمات' },
  writeReview: { en: 'Write a Review', ar: 'اكتب تقييم' },
  yourReview: { en: 'Your Review', ar: 'تقييمك' },
  yourRating: { en: 'Your Rating', ar: 'تقييمك' },
  reviewComment: { en: 'Comment (optional)', ar: 'تعليق (اختياري)' },
  submitReview: { en: 'Submit Review', ar: 'إرسال التقييم' },
  reviewSubmitted: { en: 'Review submitted successfully', ar: 'تم إرسال التقييم بنجاح' },
  reviewUpdated: { en: 'Review updated successfully', ar: 'تم تحديث التقييم بنجاح' },
  noReviews: { en: 'No reviews yet', ar: 'لا توجد تقييمات بعد' },
  beFirstReview: { en: 'Be the first to review this product', ar: 'كن أول من يقيم هذا المنتج' },
  uploadImages: { en: 'Upload Images', ar: 'رفع صور' },
  maxImageSize: { en: 'Max 2MB per image', ar: 'الحد الأقصى 2 ميجا للصورة' },
  loginToReview: { en: 'Login to write a review', ar: 'سجل دخول لكتابة تقييم' },
  averageRating: { en: 'Average Rating', ar: 'متوسط التقييم' },
  basedOnReviews: { en: 'based on', ar: 'بناءً على' },
  reviewsCount: { en: 'reviews', ar: 'تقييم' },

  // Results Page
  results: { en: 'Results', ar: 'النتائج' },
  realResults: { en: 'Real Results from Our Clients', ar: 'نتائج حقيقية من عملائنا' },
  transformationJourney: { en: 'Transformation Journey', ar: 'رحلة التحوّل' },
  resultsDescription: { en: 'See how Reselience Gold helped our clients restore their natural hair beauty', ar: 'شاهدي كيف ساعد Reselience Gold عملاءنا على استعادة جمال شعرهم الطبيعي' },
  startYourJourney: { en: 'Start Your Journey Now', ar: 'ابدأي رحلتك الآن' },
  joinHappyCustomers: { en: 'Join thousands of happy customers', ar: 'انضمي لآلاف العملاء السعداء' },
  twoMonths: { en: '2 Months', ar: '2 شهور' },

  // FAQ Page
  frequentlyAskedQuestions: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
  haveMoreQuestions: { en: 'Have more questions? Reach out to us anytime', ar: 'لديك أسئلة أخرى؟ تواصل معنا في أي وقت' },
  faqSafeQuestion: { en: 'Is the product safe for children or pregnant women?', ar: 'هل المنتج آمن للأطفال أو الحوامل؟' },
  faqSafeAnswer: { en: 'Yes, it is completely safe because it is natural.', ar: 'نعم، آمن تماماً لأنه طبيعي.' },
  faqUsageQuestion: { en: 'How many times do I use it a week?', ar: 'كم مرة أستخدمه في الأسبوع؟' },
  faqUsageAnswer: { en: 'Use it 3 to 4 times a week.', ar: 'استخدميه من 3 إلى 4 مرات في الأسبوع.' },
  faqResultsQuestion: { en: 'When do the results appear?', ar: 'متى تظهر النتائج؟' },
  faqResultsAnswer: { en: 'Some people noticed a difference from the first week, and full results occurred within a month and a half to 3 months, depending on the case.', ar: 'لاحظ البعض فرقاً من الأسبوع الأول، وظهرت النتائج الكاملة خلال شهر ونصف إلى 3 أشهر، حسب الحالة.' },
  faqCancelQuestion: { en: 'How can I cancel an order?', ar: 'كيف يمكنني إلغاء طلب؟' },
  faqCancelAnswer: { en: 'To cancel the order, send a message to the support team on our official Facebook page.', ar: 'لإلغاء الطلب، أرسل رسالة لفريق الدعم على صفحتنا الرسمية على فيسبوك.' },
  faqPaymentQuestion: { en: 'What payment methods do you accept?', ar: 'ما طرق الدفع المتاحة؟' },
  faqPaymentAnswer: { en: 'Cash on Delivery or via InstaPay or electronic wallets *Cash services*.', ar: 'الدفع عند الاستلام أو عبر InstaPay أو المحافظ الإلكترونية *خدمات كاش*.' },
  faqReturnQuestion: { en: 'What is the return policy?', ar: 'ما هي سياسة الاسترجاع؟' },
  faqReturnAnswer: { 
    en: `In order to ensure that we at Reselience provide the best possible experience to our customers, we offer the possibility of returning the product within 14 days from the date of receipt, according to the following conditions:

- The product must be unused and in its original condition exactly as it was received.
- The outer cover and all labels must be intact and unopened.
- The return process must be carried out using the same approved delivery method.
- Please note that any product that has been opened or used cannot be returned to maintain safety and hygiene standards.
- To apply for a return, please contact customer service from our social media page.

Contact our support team on social media or at our email: Info@reselience-gold.com`, 
    ar: `لضمان تقديم أفضل تجربة ممكنة لعملائنا في Reselience، نوفر إمكانية إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام، وفقاً للشروط التالية:

- يجب أن يكون المنتج غير مستخدم وفي حالته الأصلية كما تم استلامه.
- يجب أن يكون الغلاف الخارجي وجميع الملصقات سليمة وغير مفتوحة.
- يجب إجراء عملية الإرجاع باستخدام نفس طريقة التوصيل المعتمدة.
- يرجى ملاحظة أنه لا يمكن إرجاع أي منتج تم فتحه أو استخدامه للحفاظ على معايير السلامة والنظافة.
- للتقدم بطلب إرجاع، يرجى التواصل مع خدمة العملاء من صفحتنا على وسائل التواصل الاجتماعي.

تواصل مع فريق الدعم على وسائل التواصل الاجتماعي أو على بريدنا الإلكتروني: Info@reselience-gold.com`
  },

  // Terms & Conditions
  termsAndConditions: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
  returnAndExchange: { en: 'Return & Exchange', ar: 'الاسترجاع والاستبدال' },
} as const;

export type TranslationKey = keyof typeof translations;