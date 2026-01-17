import { Users, UserCheck, Calendar, Star } from "lucide-react";

const stats = [
  {
    icon: UserCheck,
    value: "٥٠٠+",
    label: "كابتن مسجل",
  },
  {
    icon: Users,
    value: "٢,٠٠٠+",
    label: "متدرب",
  },
  {
    icon: Calendar,
    value: "٥,٠٠٠+",
    label: "حجز ناجح",
  },
  {
    icon: Star,
    value: "٤.٨",
    label: "متوسط التقييم",
  },
];

const StatsSection = () => {
  return (
    <section className="section bg-primary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            أرقام تتكلم عننا
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            ثقة آلاف المتدربين والكباتن
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-primary-foreground/70 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;