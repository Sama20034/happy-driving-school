import { 
  LayoutDashboard, 
  MapPin, 
  Building2, 
  BookOpen, 
  Users, 
  Calendar,
  Clock,
  LogOut,
  ChevronRight,
  Globe
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { ShoppingBag, FolderOpen, Package, Ticket } from "lucide-react";

const menuItems = [
  { title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard },
  { title: "الحجوزات", url: "/admin/bookings", icon: Calendar },
  { title: "أكواد الخصم", url: "/admin/discount-codes", icon: Ticket },
  { title: "الدول", url: "/admin/countries", icon: Globe },
  { title: "المحافظات", url: "/admin/governorates", icon: MapPin },
  { title: "الفروع", url: "/admin/branches", icon: Building2 },
  { title: "الكورسات", url: "/admin/courses", icon: BookOpen },
  { title: "الكباتن", url: "/admin/captains", icon: Users },
  { title: "مواعيد الكباتن", url: "/admin/availability", icon: Clock },
  { title: "تصنيفات المتجر", url: "/admin/store-categories", icon: FolderOpen },
  { title: "منتجات المتجر", url: "/admin/store-products", icon: Package },
  { title: "طلبات المتجر", url: "/admin/store-orders", icon: ShoppingBag },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-card border-l border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">لوحة التحكم</h2>
        <p className="text-sm text-muted-foreground">إدارة النظام</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                end={item.url === "/admin"}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  "hover:bg-muted text-muted-foreground"
                )}
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <item.icon size={20} />
                <span>{item.title}</span>
                <ChevronRight size={16} className="mr-auto" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full hover:bg-destructive/10 text-destructive transition-colors"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
