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
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-background/5 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-background/5 rounded-full" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block bg-background/10 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-background/20">
            إحصائيات
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            أرقام تتكلم عننا
          </h2>
          <p className="text-background/70 text-lg">ثقة آلاف المتدربين والكباتن</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-background/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-background/20 hover:bg-background/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-background/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform border border-background/20">
                <stat.icon className="text-primary-foreground" size={28} />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">{stat.value}</div>
              <div className="text-background/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
