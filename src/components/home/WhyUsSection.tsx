import { Shield, Car, CreditCard, UserCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: UserCheck,
    title: "كباتن موثقين",
    description: "بيانات حقيقية وتقييمات فعلية من متدربين سابقين لضمان جودة التدريب",
    gradient: "from-primary to-primary/80"
  },
  {
    icon: Car,
    title: "معرفة تفاصيل العربية",
    description: "شوف نوع العربية وناقل الحركة (مانيوال أو أوتوماتيك) قبل ما تحجز",
    gradient: "from-primary/90 to-primary/70"
  },
  {
    icon: CreditCard,
    title: "حجز آمن بديبوزيت",
    description: "ادفع ديبوزيت بسيط لضمان حق الطرفين وتأكيد جدية الحجز",
    gradient: "from-primary/80 to-primary/60"
  },
  {
    icon: Shield,
    title: "حماية وأمان",
    description: "نوفر بيئة آمنة للمتدرب والكابتن مع ضمان حقوق الجميع",
    gradient: "from-primary to-primary/80"
  }
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            مميزاتنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">ليه تختارنا؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            منصة مصممة لتوفير تجربة حجز سهلة وآمنة لتدريب القيادة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative bg-card rounded-3xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Number badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
              
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20`}>
                  <benefit.icon className="text-primary-foreground" size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 text-lg shadow-xl shadow-primary/20 group"
            asChild
          >
            <Link to="/about">
              اعرف أكتر عننا
              <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
