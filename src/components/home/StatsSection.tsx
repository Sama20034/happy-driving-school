import { Users, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "١٧,١٤٦",
    label: "متدرب راضي عن الخدمة",
  },
  {
    icon: Award,
    value: "١٥",
    label: "كابتن محترف",
  },
  {
    icon: Clock,
    value: "٨٤,٦٠٢",
    label: "حصة تدريبية منجزة",
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-primary-foreground" size={28} />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
