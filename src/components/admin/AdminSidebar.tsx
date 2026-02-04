import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { name: 'إدارة بيانات المنتجات', href: '/admin', icon: LayoutDashboard },
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
