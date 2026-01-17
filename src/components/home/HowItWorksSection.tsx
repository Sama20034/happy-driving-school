import { UserPlus, Search, CreditCard, Car } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "١",
    title: "سجّل حسابك",
    description: "أنشئ حساب مجاني في دقيقة"
  },
  {
    icon: Search,
    number: "٢",
    title: "اختار كابتن",
    description: "تصفح الكباتن والتقييمات"
  },
  {
    icon: CreditCard,
    number: "٣",
    title: "ادفع الديبوزيت",
    description: "أكّد الحجز بديبوزيت بسيط"
  },
  {
    icon: Car,
    number: "٤",
    title: "ابدأ التدريب",
    description: "قابل الكابتن وابدأ التعلم"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="section bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wide mb-3 block">
            الخطوات
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            إزاي تحجز؟
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            ٤ خطوات بسيطة وتبدأ رحلة التعلم
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-border" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Number circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center mx-auto mb-6 group-hover:border-primary/30 transition-colors">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;