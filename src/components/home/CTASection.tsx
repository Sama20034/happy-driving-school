import { Link } from "react-router-dom";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🚗 جاهزة تبدئي رحلتك في تعلم السواقة؟
          </h2>
          <p className="text-lg opacity-90 mb-4">
            اتصلي دلوقتي أو كلمينا على رسائل الصفحة وهيتم الرد عليكي في أسرع وقت ممكن 👌
          </p>
          <p className="text-xl font-bold mb-8">
            #كابتن_دينا_أحمد #مفهوم_جديد_فى_السواقة
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6"
              asChild
            >
              <Link to="/booking">
                <Calendar className="ml-2" size={20} />
                احجز كورسك الآن
              </Link>
            </Button>
            
            <Button
              size="lg"
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
              asChild
            >
              <a href="tel:01220501299">
                <Phone className="ml-2" size={20} />
                اتصلي الآن
              </a>
            </Button>
            
            <Button
              size="lg"
              className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400/10 text-lg px-8 py-6"
              asChild
            >
              <a href="https://wa.me/201220501299" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="ml-2" size={20} />
                واتساب
              </a>
            </Button>
          </div>
          
          {/* Phone Numbers */}
          <div className="mt-8 pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/80 mb-3">للمزيد من التفاصيل والحجز:</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-2xl font-bold">
              <a href="tel:01220501299" className="hover:underline" dir="ltr">
                0122 050 1299
              </a>
              <a href="tel:01271999937" className="hover:underline" dir="ltr">
                0127 199 9937
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
