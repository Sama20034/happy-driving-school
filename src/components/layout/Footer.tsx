import { Link } from "react-router-dom";
import { Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
const Footer = () => {
  return <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <img src={logo} alt="دينا أحمد" className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-background/70 leading-relaxed">
              أكاديمية متخصصة في تعليم قيادة السيارات بالقيادة الدفاعية والآمنة مع خبرة أكتر من 15 سنة
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-background/70 hover:text-background transition-colors">
                  الكورسات
                </Link>
              </li>
              <li>
                <Link to="/why-us" className="text-background/70 hover:text-background transition-colors">
                  لماذا نحن
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-background/70 hover:text-background transition-colors">
                  احجز الآن
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-background/70 hover:text-background transition-colors">
                  حجوزاتي
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-background/70 hover:text-background transition-colors">
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
                <a href="tel:01220501299" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                  <Phone size={18} />
                  <span dir="ltr">0122 050 1299</span>
                </a>
              </li>
              <li>
                <a href="tel:01271999937" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                  <Phone size={18} />
                  <span dir="ltr">0127 199 9937</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <MapPin size={18} />
                <span>مصر - القاهرة والجيزة</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-4">تابعنا على السوشيال ميديا</h4>
            <div className="flex items-center gap-4 mb-4">
              <a href="https://www.facebook.com/dina.driving" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/dina.driving" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/201220501299" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-green-500 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="text-background/60 text-sm">اتصلي دلوقتي أو كلمينا على رسائل الصفحة وهيتم الرد عليكي في أسرع وقت ممكن </p>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60 space-y-2">
          <p>© {new Date().getFullYear()} كابتن دينا أحمد - Defensive Driving. جميع الحقوق محفوظة</p>
          <p>
            تم التصميم بواسطة{" "}
            <a 
              href="https://digitfans.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              شركة ديجيت فانز
            </a>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;