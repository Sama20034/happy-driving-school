import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="text-8xl font-bold gradient-text">404</span>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          عذراً! الصفحة غير موجودة
        </h1>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          الصفحة التي تبحث عنها قد تكون حُذفت أو تم نقلها أو غير متوفرة مؤقتاً.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gradient-primary text-primary-foreground gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/booking">
              احجز الآن
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;