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
    <section className="section gradient-navy-soft relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
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
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[3px] bg-gradient-to-l from-primary/30 via-primary/50 to-primary/30 rounded-full" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Number circle with gradient */}
                <div className="relative z-10 w-20 h-20 rounded-2xl gradient-navy flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/15">
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