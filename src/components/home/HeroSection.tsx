import { Link } from "react-router-dom";
import { UserPlus, Shield, Car, Sparkles, Star, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-primary overflow-hidden flex items-center">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large decorative circles */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-background/5" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-background/5" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-[15%] w-24 h-24 rounded-2xl bg-background/10 rotate-12 animate-float" />
        <div className="absolute top-1/3 right-[20%] w-16 h-16 rounded-full bg-background/10 animate-float-slow" />
        <div className="absolute bottom-1/4 left-[25%] w-20 h-20 rounded-xl bg-background/10 -rotate-12 animate-float" />
        <div className="absolute bottom-1/3 right-[10%] w-12 h-12 rounded-lg bg-background/10 rotate-45 animate-float-slow" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--background)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-background/20 animate-fade-in">
            <Sparkles className="w-4 h-4 text-background" />
            <span className="text-sm font-medium">المنصة الأولى لتدريب القيادة في مصر</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-background text-background" />
              ))}
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            تدريب قيادة <span className="text-background/80">آمن</span>
            <br />
            مع كباتن <span className="text-background/80">موثوقين</span>
          </h1>
          
          <p className="text-lg md:text-xl text-background/70 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            اختار الكابتن المناسب، شوف تقييمه ونوع عربيته، واحجز بكل أمان من خلال الموقع
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm px-5 py-3 rounded-full border border-background/20 hover:bg-background/20 transition-colors">
              <Car className="w-5 h-5" />
              <span className="font-medium">كباتن موثقين</span>
            </div>
            <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm px-5 py-3 rounded-full border border-background/20 hover:bg-background/20 transition-colors">
              <Shield className="w-5 h-5" />
              <span className="font-medium">دفع آمن</span>
            </div>
            <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm px-5 py-3 rounded-full border border-background/20 hover:bg-background/20 transition-colors">
              <Star className="w-5 h-5" />
              <span className="font-medium">تقييمات حقيقية</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 text-lg px-12 py-7 rounded-full shadow-xl shadow-primary/30 font-semibold group" 
              asChild
            >
              <Link to="/auth">
                <UserPlus className="ml-2" size={22} />
                سجّل الآن
                <ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1" size={18} />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-background/30 text-primary-foreground hover:bg-background/10 hover:border-background/50 text-lg px-10 py-7 rounded-full transition-all" 
              asChild
            >
              <Link to="/booking">
                احجز كابتن
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-background/60 text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>+500 كابتن مسجل</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>+2000 متدرب</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>4.8 متوسط التقييم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
