import { Shield, Car, CreditCard, UserCheck } from "lucide-react";

const benefits = [
  {
    icon: UserCheck,
    title: "كباتن موثقين",
    description: "جميع الكباتن تم التحقق من بياناتهم ورخصهم"
  },
  {
    icon: Car,
    title: "اختر عربيتك",
    description: "شوف نوع العربية ونظام الجير قبل الحجز"
  },
  {
    icon: CreditCard,
    title: "دفع آمن",
    description: "ادفع ديبوزيت بسيط لتأكيد الحجز"
  },
  {
    icon: Shield,
    title: "ضمان الحقوق",
    description: "نظام يضمن حقوق المتدرب والكابتن"
  }
];

const WhyUsSection = () => {
  return (
    <section className="section bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wide mb-3 block">
            المميزات
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ليه تختارنا؟
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            منصة مصممة لتوفير تجربة تدريب قيادة آمنة ومريحة
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/20 hover:shadow-soft-md transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-primary/12 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;