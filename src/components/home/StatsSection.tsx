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
    <section className="section gradient-navy-radial relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            أرقام تتكلم عننا
          </h2>
          <p className="text-white/60 text-lg">
            ثقة آلاف المتدربين والكباتن
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/10 hover:bg-white/[0.12] transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">
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