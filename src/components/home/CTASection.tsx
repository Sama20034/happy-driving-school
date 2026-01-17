import { Link } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            جاهز تبدأ رحلتك في تعلم القيادة؟
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            سجّل دلوقتي واختار الكابتن المناسب ليك وابدأ التدريب بكل أمان
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground text-lg px-10 py-6 rounded-full shadow-glow hover:opacity-90 transition-opacity"
              asChild
            >
              <Link to="/auth">
                <UserPlus className="ml-2" size={22} />
                سجّل الآن مجاناً
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-2"
              asChild
            >
              <Link to="/booking">
                تصفح الكباتن
                <ArrowLeft className="mr-2" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
