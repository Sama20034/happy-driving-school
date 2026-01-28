import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Calendar, LogOut, Settings, ShoppingCart, Package, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/captains", label: "الكباتن" },
  { href: "/services", label: "خدماتنا" },
  { href: "/about", label: "من نحن" },
  { href: "/store", label: "المتجر" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, userRole, signOut, loading } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-primary/95 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <span className="text-white font-bold text-base">ك</span>
            </div>
            <span className="text-lg font-semibold text-white">كابتن مصر</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart & CTA Button & User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart Button */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-white/80 hover:text-white hover:bg-white/10">
                <ShoppingCart size={18} />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-white text-primary">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {loading ? (
              <div className="h-9 w-20 bg-white/10 animate-pulse rounded-lg"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-9 text-white/80 hover:text-white hover:bg-white/10">
                    <User size={16} />
                    <span className="max-w-[80px] truncate text-sm">
                      {user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-primary/10">
                  {(userRole === 'captain' || userRole === 'trainee') && (
                    <DropdownMenuItem asChild>
                      <Link 
                        to={userRole === 'captain' ? '/captain-dashboard' : '/trainee-dashboard'} 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard size={14} />
                        لوحة التحكم
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center gap-2 cursor-pointer">
                      <Calendar size={14} />
                      حجوزاتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders" className="flex items-center gap-2 cursor-pointer">
                      <Package size={14} />
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Settings size={14} />
                        لوحة الأدمن
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive cursor-pointer"
                  >
                    <LogOut size={14} />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="h-9 text-white/80 hover:text-white hover:bg-white/10" asChild>
                <Link to="/auth">تسجيل الدخول</Link>
              </Button>
            )}
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 rounded-lg h-9 px-5 font-medium" asChild>
              <Link to="/auth">سجّل الآن</Link>
            </Button>
          </div>

          {/* Mobile Cart & Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <Link to="/cart" className="relative p-2 text-white/80">
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <Badge className="absolute top-0 left-0 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-white text-primary">
                  {getTotalItems()}
                </Badge>
              )}
            </Link>
            <button
              className="p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 bg-primary">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  {(userRole === 'captain' || userRole === 'trainee') && (
                    <Link
                      to={userRole === 'captain' ? '/captain-dashboard' : '/trainee-dashboard'}
                      className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium rounded-lg flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      لوحة التحكم
                    </Link>
                  )}
                  <Link
                    to="/my-bookings"
                    className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium rounded-lg flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={16} />
                    حجوزاتي
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium rounded-lg flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings size={16} />
                      لوحة الأدمن
                    </Link>
                  )}
                </>
              )}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-white/10">
                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-300 hover:text-red-200 hover:bg-white/10 justify-start"
                  >
                    <LogOut size={16} className="ml-2" />
                    تسجيل الخروج
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="justify-start text-white/70 hover:text-white hover:bg-white/10" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      تسجيل الدخول
                    </Link>
                  </Button>
                )}
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 rounded-lg" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    سجّل الآن
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;