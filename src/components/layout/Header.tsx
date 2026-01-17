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
  { href: "/booking", label: "احجز كابتن" },
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
    <header className="fixed top-0 right-0 left-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">ك</span>
            </div>
            <span className="text-xl font-bold text-primary">كباتن القيادة</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart & CTA Button & User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {loading ? (
              <div className="h-10 w-24 bg-muted animate-pulse rounded-lg"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User size={18} />
                    <span className="max-w-[100px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card">
                  {(userRole === 'captain' || userRole === 'trainee') && (
                    <DropdownMenuItem asChild>
                      <Link 
                        to={userRole === 'captain' ? '/captain-dashboard' : '/trainee-dashboard'} 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard size={16} />
                        لوحة التحكم
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center gap-2 cursor-pointer">
                      <Calendar size={16} />
                      حجوزاتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders" className="flex items-center gap-2 cursor-pointer">
                      <Package size={16} />
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Settings size={16} />
                        لوحة الأدمن
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive cursor-pointer"
                  >
                    <LogOut size={16} />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">تسجيل الدخول</Link>
              </Button>
            )}
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6" asChild>
              <Link to="/auth">سجّل الآن</Link>
            </Button>
          </div>

          {/* Mobile Cart & Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart size={22} />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-0.5 -left-0.5 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Link>
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
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
                      className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      لوحة التحكم
                    </Link>
                  )}
                  <Link
                    to="/my-bookings"
                    className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={18} />
                    حجوزاتي
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings size={18} />
                      لوحة الأدمن
                    </Link>
                  )}
                </>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-destructive"
                  >
                    <LogOut size={18} className="ml-2" />
                    تسجيل الخروج
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      تسجيل الدخول
                    </Link>
                  </Button>
                )}
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full" asChild>
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
