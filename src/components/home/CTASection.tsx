import { Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-[2rem] p-10 md:p-14 border border-border shadow-2xl shadow-primary/5 relative overflow-hidden">
            {/* Decorative corner shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">ابدأ مجاناً</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                جاهز تبدأ رحلتك في
                <br />
                <span className="text-primary">تعلم القيادة؟</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                سجّل دلوقتي واختار الكابتن المناسب ليك وابدأ التدريب بكل أمان
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground text-lg px-12 py-7 rounded-full shadow-xl shadow-primary/20 hover:bg-primary/90 group"
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
                  className="text-lg px-10 py-7 rounded-full border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 group"
                  asChild
                >
                  <Link to="/booking">
                    تصفح الكباتن
                    <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={20} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
