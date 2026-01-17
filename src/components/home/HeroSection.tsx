import { Link } from "react-router-dom";
import { UserPlus, Shield, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] gradient-hero overflow-hidden flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary-foreground/20">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">منصة آمنة وموثوقة</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            تدريب قيادة آمن مع كباتن موثوقين بالقرب منك
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            اختار الكابتن المناسب، شوف تقييمه ونوع عربيته، واحجز بكل أمان من خلال الموقع
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <Car className="w-4 h-4" />
              <span className="text-sm">كباتن موثقين</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm">دفع آمن</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6 rounded-full shadow-glow" 
              asChild
            >
              <Link to="/auth">
                <UserPlus className="ml-2" size={22} />
                سجّل الآن
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-full" 
              asChild
            >
              <Link to="/booking">
                احجز كابتن
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
