import { Link } from "react-router-dom";
import { Calendar, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedParticles from "./AnimatedParticles";
const features = ["تدريب عملي مع مدربين ومدربات محترفين بخبرة 15 سنة", "القيادة الدفاعية والآمنة مع التأهيل النفسي للتخلص من الخوف", "تعليم نظري وعملي في طرق مزدحمة وطرق السفر"];
const HeroSection = () => {
  return <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Animated Particles */}
      <AnimatedParticles />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"> أكاديمية كابتن دينا أحمد لتعليم السواقة</h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-10">
            مفهوم جديد في السواقة - Defensive Driving
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4 mb-10">
            {features.map((feature, index) => <div key={index} className="feature-card bg-primary-foreground/10 border-primary-foreground/20 justify-center">
                <CheckCircle className="text-accent flex-shrink-0" size={22} />
                <span className="text-primary-foreground font-medium">{feature}</span>
              </div>)}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6 rounded-full shadow-glow" asChild>
              <Link to="/booking">
                <Calendar className="ml-2" size={22} />
                احجز كورسك الآن
              </Link>
            </Button>
            
            <Button size="lg" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-full" asChild>
              <a href="tel:01220501299">
                <Phone className="ml-2" size={20} />
                اتصلي الآن
              </a>
            </Button>
          </div>
          
          {/* Phone Numbers */}
          <div className="mt-8">
            <p className="text-primary-foreground/80 text-sm mb-2">للحجز والاستفسار:</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="tel:01220501299" className="text-lg font-bold hover:underline" dir="ltr">
                0122 050 1299
              </a>
              <span className="text-primary-foreground/50">-</span>
              <a href="tel:01271999937" className="text-lg font-bold hover:underline" dir="ltr">
                0127 199 9937
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;