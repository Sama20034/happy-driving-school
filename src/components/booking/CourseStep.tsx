import { BookOpen, Clock } from "lucide-react";
import { useCoursesWithPrices } from "@/hooks/useBookingData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseStepProps {
  governorateId: string;
  branchId: string;
  selectedId: string;
  onSelect: (id: string, name: string, price: number, sessions: number) => void;
}

const CourseStep = ({ governorateId, branchId, selectedId, onSelect }: CourseStepProps) => {
  const { courses, loading, error } = useCoursesWithPrices(governorateId, branchId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">اختر الكورس</h2>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">اختر الكورس</h2>
        <p className="text-muted-foreground">اختر الكورس المناسب لمستواك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelect(course.id, course.title, course.customPrice, course.sessions)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-glow text-right",
              selectedId === course.id
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedId === course.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold text-primary">{course.customPrice}</span>
                <span className="text-muted-foreground text-sm mr-1">جنيه</span>
              </div>
            </div>
            
            <h3 className="font-bold text-xl mb-2">{course.title}</h3>
            {course.description && (
              <p className="text-muted-foreground mb-3">{course.description}</p>
            )}
            
            <div className="flex items-center gap-2 text-primary font-medium">
              <Clock size={18} />
              <span>{course.sessions} {course.sessions === 1 ? "حصة" : "حصص"}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseStep;
