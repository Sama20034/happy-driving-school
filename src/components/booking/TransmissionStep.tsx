import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
interface TransmissionStepProps {
  selectedType: "manual" | "automatic" | "";
  onSelect: (type: "manual" | "automatic") => void;
}
const TransmissionStep = ({
  selectedType,
  onSelect
}: TransmissionStepProps) => {
  const options = [{
    type: "manual" as const,
    title: "مانوال",
    subtitle: "Manual",
    description: "ناقل حركة يدوي",
    icon: "🚗"
  }, {
    type: "automatic" as const,
    title: "أوتوماتيك",
    subtitle: "Automatic",
    description: "ناقل حركة أوتوماتيكي",
    icon: "🚙"
  }];
  return <div>
      <h2 className="text-2xl font-bold mb-2 text-center">اختر نوع ناقل الحركة</h2>
      <p className="text-muted-foreground mb-8 text-center">
        هل تفضل التدريب على سيارة مانوال أم أوتوماتيك؟
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {options.map(option => <button key={option.type} onClick={() => onSelect(option.type)} className={cn("p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg group", selectedType === option.type ? "border-primary bg-primary/10 shadow-lg" : "border-border bg-card hover:border-primary/50")}>
            <div className="flex flex-col items-center gap-4">
              
              <div className="text-center">
                <h3 className="font-bold text-xl mb-1">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{option.subtitle}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </button>)}
      </div>
    </div>;
};
export default TransmissionStep;