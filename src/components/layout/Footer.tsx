import { Link } from "react-router-dom";
import { Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">كباتن القيادة</h3>
            <p className="text-primary-foreground/70 leading-relaxed">
              منصة حجز كباتن تدريب القيادة الموثوقين. نوفر بيئة آمنة للتدريب مع ضمان حقوق المتدرب والكابتن.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  احجز كابتن
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:01220501299" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Phone size={18} />
                  <span dir="ltr">0122 050 1299</span>
                </a>
              </li>
              <li>
                <a href="tel:01271999937" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Phone size={18} />
                  <span dir="ltr">0127 199 9937</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin size={18} />
                <span>مصر - القاهرة والجيزة</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-4">تابعنا</h4>
            <div className="flex items-center gap-4 mb-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://wa.me/201220501299" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              تواصل معنا على مدار الساعة
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>© {new Date().getFullYear()} كباتن القيادة. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
