import { Users, UserCheck, Calendar, Star } from "lucide-react";

const stats = [
  {
    icon: UserCheck,
    value: "٥٠+",
    label: "كابتن مسجل",
  },
  {
    icon: Users,
    value: "١,٠٠٠+",
    label: "متدرب",
  },
  {
    icon: Calendar,
    value: "٢,٥٠٠+",
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
    <section className="py-16 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            أرقام تتكلم عننا
          </h2>
          <p className="text-primary-foreground/80">ثقة آلاف المتدربين والكباتن</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/20 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-primary-foreground" size={24} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</div>
              <div className="text-primary-foreground/80 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
