import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main content */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            جاهز تبدأ رحلتك؟
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
            سجّل دلوقتي واختار الكابتن المناسب ليك
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl font-medium shadow-soft-md"
              asChild
            >
              <Link to="/auth">
                سجّل الآن مجاناً
                <ArrowLeft className="mr-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 text-base px-8 py-6 rounded-xl font-medium"
              asChild
            >
              <Link to="/captains">
                تصفح الكباتن
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;