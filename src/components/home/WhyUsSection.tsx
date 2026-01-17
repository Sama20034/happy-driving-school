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
    <section className="section bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
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
              className="group p-8 rounded-2xl bg-card border border-primary/10 hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-14 h-14 rounded-xl gradient-navy flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <benefit.icon className="w-6 h-6 text-white" />
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