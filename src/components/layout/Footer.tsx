import { Link } from "react-router-dom";
import { Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base">ك</span>
              </div>
              <span className="text-lg font-semibold">كباتن القيادة</span>
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

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">تابعنا</h4>
            <div className="flex items-center gap-3 mb-3">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://wa.me/201220501299" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
            <p className="text-primary-foreground/60 text-xs">
              تواصل معنا على مدار الساعة
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} كباتن القيادة. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;