import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import logoImg from "@/assets/logo-captain-misr-colored.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <div className="mb-4">
              <img src={logoImg} alt="كابتن مصر لتعليم القيادة" className="h-14 w-auto" />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              منصة حجز كباتن تدريب القيادة الموثوقين. نوفر بيئة آمنة للتدريب مع ضمان حقوق المتدرب والكابتن.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "الرئيسية" },
                { to: "/captains", label: "الكباتن" },
                { to: "/about", label: "من نحن" },
                { to: "/terms", label: "الشروط والأحكام" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:01220501299" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  <Phone size={16} />
                  <span dir="ltr">0122 050 1299</span>
                </a>
              </li>
              <li>
                <a href="tel:01271999937" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  <Phone size={16} />
                  <span dir="ltr">0127 199 9937</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <MapPin size={16} />
                <span>مصر - القاهرة والجيزة</span>
              </li>
            </ul>
          </div>

          {/* App Info */}
          <div>
            <h4 className="font-semibold mb-4">التطبيق</h4>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              حمّل تطبيق كابتن مصر واحجز كابتن التدريب المناسب لك بسهولة وأمان.
            </p>
            <p className="text-primary-foreground/60 text-xs mt-3">
              تواصل معنا على مدار الساعة
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center space-y-2">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} كابتن مصر. جميع الحقوق محفوظة
          </p>
          <p className="text-primary-foreground/50 text-xs">
            © created by{" "}
            <a 
              href="https://digitfans.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-foreground transition-colors underline"
            >
              Digitfans
            </a>{" "}
            2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;