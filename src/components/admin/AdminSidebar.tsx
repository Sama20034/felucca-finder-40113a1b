import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Users, Ticket, Gift, Truck, LogOut, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    { name: 'المنتجات', href: '/admin/products', icon: Package },
    { name: 'الفئات', href: '/admin/categories', icon: FolderTree },
    { name: 'فلاتر المتجر', href: '/admin/filters', icon: SlidersHorizontal },
    { name: 'الطلبات', href: '/admin/orders', icon: ShoppingBag },
    { name: 'العملاء', href: '/admin/customers', icon: Users },
    { name: 'الكوبونات', href: '/admin/coupons', icon: Ticket },
    { name: 'نظام الولاء', href: '/admin/loyalty', icon: Gift },
    { name: 'الشركاء', href: '/admin/affiliates', icon: Users },
    { name: 'الشحن', href: '/admin/shipping', icon: Truck },
    { name: 'الاسترجاع', href: '/admin/returns', icon: RotateCcw },
  ];

  return (
    <aside className="w-64 bg-card border-l border-border min-h-screen sticky top-0">
      <div className="p-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2">لوحة التحكم</h2>
          <Link to="/" className="text-sm text-primary hover:underline">العودة للمتجر</Link>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-destructive hover:bg-destructive/10 w-full mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
