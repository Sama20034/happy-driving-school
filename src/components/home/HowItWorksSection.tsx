import { UserPlus, Search, CreditCard, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "١",
    title: "سجّل بياناتك",
    description: "أنشئ حساب مجاني في دقائق"
  },
  {
    icon: Search,
    number: "٢",
    title: "اختار الكابتن",
    description: "تصفح الكباتن حسب الموقع والتقييم"
  },
  {
    icon: CreditCard,
    number: "٣",
    title: "ادفع الديبوزيت",
    description: "ادفع ديبوزيت بسيط لتأكيد الحجز"
  },
  {
    icon: MessageCircle,
    number: "٤",
    title: "ابدأ التدريب",
    description: "تواصل مع الكابتن وابدأ رحلتك"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">إزاي تحجز؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ٤ خطوات بسيطة وتبدأ رحلة تعلم القيادة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="step-card group">
              {/* Step Number */}
              <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {step.number}
              </div>
              
              <div className="pt-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <step.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
