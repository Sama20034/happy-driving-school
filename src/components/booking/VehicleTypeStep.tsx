import { Car, Bike, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export type VehicleType = "car" | "motorcycle" | "heavy_transport" | "";

interface VehicleTypeStepProps {
  selectedType: VehicleType;
  onSelect: (type: VehicleType) => void;
}

const VehicleTypeStep = ({
  selectedType,
  onSelect
}: VehicleTypeStepProps) => {
  const options = [
    {
      type: "car" as const,
      title: "سيارة",
      subtitle: "Car",
      description: "تعلم قيادة السيارات",
      icon: Car
    },
    {
      type: "motorcycle" as const,
      title: "موتوسيكل / سكوتر",
      subtitle: "Motorcycle / Scooter",
      description: "تعلم قيادة الدراجات النارية",
      icon: Bike
    },
    {
      type: "heavy_transport" as const,
      title: "نقل ثقيل",
      subtitle: "Heavy Transport",
      description: "تعلم قيادة الشاحنات والنقل الثقيل",
      icon: Truck
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">اختر نوع المركبة</h2>
      <p className="text-muted-foreground mb-8 text-center">
        ما نوع المركبة التي تريد التدريب عليها؟
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {options.map(option => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              className={cn(
                "p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg group",
                selectedType === option.type
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                  selectedType === option.type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{option.subtitle}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleTypeStep;
