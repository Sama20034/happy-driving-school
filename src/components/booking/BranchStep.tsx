import { Building2, MapPin } from "lucide-react";
import { useBranches } from "@/hooks/useBookingData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BranchStepProps {
  governorateId: string;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}

const BranchStep = ({ governorateId, selectedId, onSelect }: BranchStepProps) => {
  const { branches, loading, error } = useBranches(governorateId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">اختر الفرع</h2>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
        <h2 className="text-2xl font-bold mb-2">اختر الفرع</h2>
        <p className="text-muted-foreground">حدد الفرع الأقرب لك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => onSelect(branch.id, branch.name)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-glow text-right",
              selectedId === branch.id
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedId === branch.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{branch.name}</h3>
                {branch.address && (
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin size={14} />
                    {branch.address}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BranchStep;
