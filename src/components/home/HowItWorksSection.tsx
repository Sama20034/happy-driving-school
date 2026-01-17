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
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            خطوات الحجز
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">إزاي تحجز؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ٤ خطوات بسيطة وتبدأ رحلة تعلم القيادة
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-gradient-to-l from-primary via-primary/50 to-primary/20 -translate-y-1/2 rounded-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-card rounded-3xl p-8 text-center border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 relative z-10">
                  {/* Step Number */}
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  
                  <div className="w-20 h-20 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                    <step.icon className="text-primary" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
