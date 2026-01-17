import { Star, User } from "lucide-react";
import { useCaptains } from "@/hooks/useBookingData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CaptainStepProps {
  branchId: string;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}

const CaptainStep = ({ branchId, selectedId, onSelect }: CaptainStepProps) => {
  const { captains, loading, error } = useCaptains(branchId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">اختر الكابتن</h2>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
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

  if (captains.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">اختر الكابتن</h2>
          <p className="text-muted-foreground">لا يوجد كباتن متاحين في هذا الفرع حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">اختر الكابتن</h2>
        <p className="text-muted-foreground">اختر المدرب المناسب لك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {captains.map((captain) => (
          <button
            key={captain.id}
            onClick={() => onSelect(captain.id, captain.name)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-glow",
              selectedId === captain.id
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              {captain.image_url ? (
                <img
                  src={captain.image_url}
                  alt={captain.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User size={40} className="text-muted-foreground" />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">{captain.name}</h3>
                {captain.rating && (
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star size={18} fill="currentColor" />
                    <span className="font-bold">{captain.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CaptainStep;
