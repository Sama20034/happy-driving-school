import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-[90vh] bg-background flex items-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Small badge */}
          <div 
            className="inline-flex items-center gap-2 bg-primary/8 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in"
          >
            <Star className="w-4 h-4 fill-primary/30" />
            <span>المنصة الأولى لتدريب القيادة في مصر</span>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            ابدأ رحلتك في
            <br />
            <span className="text-primary">تعلّم القيادة</span>
          </h1>
          
          {/* Description */}
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            احجز كابتن تدريب موثوق بالقرب منك، شوف التقييمات ونوع العربية، وابدأ التدريب بأمان
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl font-medium shadow-soft-md hover:shadow-soft-lg transition-all" 
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
              className="border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 text-base px-8 py-6 rounded-xl font-medium transition-all" 
              asChild
            >
              <Link to="/captains">
                تصفح الكباتن
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">+٥٠٠</div>
                <div className="text-sm text-muted-foreground">كابتن مسجل</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary fill-primary/30" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">٤.٨</div>
                <div className="text-sm text-muted-foreground">متوسط التقييم</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">+٢٠٠٠</div>
                <div className="text-sm text-muted-foreground">متدرب سعيد</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;