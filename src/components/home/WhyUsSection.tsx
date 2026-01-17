import { Shield, Car, CreditCard, UserCheck } from "lucide-react";

const benefits = [
  {
    icon: UserCheck,
    title: "كباتن موثقين",
    description: "بيانات حقيقية وتقييمات فعلية من متدربين سابقين لضمان جودة التدريب"
  },
  {
    icon: Car,
    title: "معرفة تفاصيل العربية",
    description: "شوف نوع العربية وناقل الحركة (مانيوال أو أوتوماتيك) قبل ما تحجز"
  },
  {
    icon: CreditCard,
    title: "حجز آمن بديبوزيت",
    description: "ادفع ديبوزيت بسيط لضمان حق الطرفين وتأكيد جدية الحجز"
  },
  {
    icon: Shield,
    title: "حماية وأمان",
    description: "نوفر بيئة آمنة للمتدرب والكابتن مع ضمان حقوق الجميع"
  }
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ليه تختارنا؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            منصة مصممة لتوفير تجربة حجز سهلة وآمنة لتدريب القيادة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <benefit.icon className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
