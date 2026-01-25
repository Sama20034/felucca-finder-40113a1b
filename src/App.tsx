import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import AllCategories from "./pages/Categories";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import PaymentMethods from "./pages/PaymentMethods";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Coupons from "./pages/admin/Coupons";
import Loyalty from "./pages/admin/Loyalty";
import Shipping from "./pages/admin/Shipping";
import AdminAffiliates from "./pages/admin/Affiliates";
import AdminReturns from "./pages/admin/Returns";
import AdminFilters from "./pages/admin/Filters";
import MyAccount from "./pages/MyAccount";
import Affiliate from "./pages/Affiliate";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";
import Results from "./pages/Results";
import ShopifyProductPage from "./pages/ShopifyProductPage";

const queryClient = new QueryClient();

// Cart sync wrapper component
const CartSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  useCartSync();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <CartSyncWrapper>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/shopify-product/:handle" element={<ShopifyProductPage />} />
                    <Route path="/categories" element={<AllCategories />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/affiliate" element={<Affiliate />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/offers" element={<Shop />} />
                    <Route path="/gifts" element={<Shop />} />
                    
                    {/* Policy Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/return-policy" element={<ReturnPolicy />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/payment-methods" element={<PaymentMethods />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
                    <Route path="/admin/products" element={<ProtectedAdminRoute><Products /></ProtectedAdminRoute>} />
                    <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />
                    <Route path="/admin/orders" element={<ProtectedAdminRoute><Orders /></ProtectedAdminRoute>} />
                    <Route path="/admin/customers" element={<ProtectedAdminRoute><Customers /></ProtectedAdminRoute>} />
                    <Route path="/admin/coupons" element={<ProtectedAdminRoute><Coupons /></ProtectedAdminRoute>} />
                    <Route path="/admin/loyalty" element={<ProtectedAdminRoute><Loyalty /></ProtectedAdminRoute>} />
                    <Route path="/admin/affiliates" element={<ProtectedAdminRoute><AdminAffiliates /></ProtectedAdminRoute>} />
                    <Route path="/admin/shipping" element={<ProtectedAdminRoute><Shipping /></ProtectedAdminRoute>} />
                    <Route path="/admin/returns" element={<ProtectedAdminRoute><AdminReturns /></ProtectedAdminRoute>} />
                    <Route path="/admin/filters" element={<ProtectedAdminRoute><AdminFilters /></ProtectedAdminRoute>} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CartSyncWrapper>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
