import { MapPin } from "lucide-react";
import { useGovernorates } from "@/hooks/useBookingData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface GovernorateStepProps {
  countryId: string;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}

const GovernorateStep = ({ countryId, selectedId, onSelect }: GovernorateStepProps) => {
  const { governorates, loading, error } = useGovernorates(countryId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">اختر المحافظة</h2>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>حدث خطأ في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">اختر المحافظة</h2>
        <p className="text-muted-foreground">حدد المحافظة التي ترغب في الحجز بها</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {governorates.map((gov) => (
          <button
            key={gov.id}
            onClick={() => onSelect(gov.id, gov.name)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-glow flex flex-col items-center gap-3",
              selectedId === gov.id
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                selectedId === gov.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <MapPin size={24} />
            </div>
            <span className="font-bold text-lg">{gov.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GovernorateStep;
