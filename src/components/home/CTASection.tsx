import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, GraduationCap, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
const CTASection = () => {
  return (
    <section className="section bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="gradient-navy rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-primary/20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
            
            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/15">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">ابدأ مجاناً</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                جاهز تبدأ رحلتك؟
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-md mx-auto">
                سجّل دلوقتي واختار الكابتن المناسب ليك
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 text-base px-8 py-6 rounded-xl font-semibold shadow-lg transition-all hover:scale-[1.02]"
                  asChild
                >
                  <Link to="/auth?role=trainee">
                    <GraduationCap className="ml-2 w-5 h-5" />
                    سجل كمتدرب
                  </Link>
                </Button>
                
                <Button
                  size="lg"
                  className="bg-white/10 border-2 border-white/25 text-white hover:bg-white/20 hover:border-white/40 text-base px-8 py-6 rounded-xl font-semibold backdrop-blur-sm transition-all hover:scale-[1.02]"
                  asChild
                >
                  <Link to="/auth?role=captain">
                    <Car className="ml-2 w-5 h-5" />
                    سجل ككابتن
                  </Link>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-2 border-white/25 text-white hover:bg-white/20 hover:border-white/40 text-base px-8 py-6 rounded-xl font-medium backdrop-blur-sm"
                  asChild
                >
                  <Link to="/captains">
                    تصفح الكباتن
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