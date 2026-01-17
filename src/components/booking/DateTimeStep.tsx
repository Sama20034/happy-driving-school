import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useCaptainAvailability } from "@/hooks/useCaptainAvailability";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface DateTimeStepProps {
  captainId: string;
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
}

const DateTimeStep = ({ captainId, selectedDate, selectedTime, onSelect }: DateTimeStepProps) => {
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    selectedDate ? parseISO(selectedDate) : undefined
  );

  const { data: timeSlots = [], isLoading } = useCaptainAvailability(captainId);
  
  const availableDates = useMemo(() => {
    return timeSlots.map((slot) => slot.date);
  }, [timeSlots]);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const slot = timeSlots.find((s) => s.date === selectedDate);
    return slot?.times || [];
  }, [selectedDate, timeSlots]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      setInternalDate(date);
      onSelect(dateStr, "");
    }
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availableDates.includes(dateStr);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">جاري تحميل المواعيد المتاحة...</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold mb-2">لا توجد مواعيد متاحة</h3>
        <p className="text-muted-foreground">
          لم يتم تحديد مواعيد لهذا الكابتن بعد. يرجى اختيار كابتن آخر أو المحاولة لاحقاً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">اختر الموعد</h2>
        <p className="text-muted-foreground">حدد تاريخ وساعة أول حصة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-4 text-primary font-bold">
            <Calendar size={20} />
            <span>اختر التاريخ</span>
          </div>
          <CalendarComponent
            mode="single"
            selected={internalDate}
            onSelect={handleDateSelect}
            locale={ar}
            disabled={(date) => !isDateAvailable(date) || date < new Date()}
            className="rounded-md pointer-events-auto"
          />
        </div>

        {/* Time Slots */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-4 text-primary font-bold">
            <Clock size={20} />
            <span>اختر الساعة</span>
          </div>

          {selectedDate ? (
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => onSelect(selectedDate, time)}
                  className={cn(
                    "p-4 rounded-xl border-2 font-bold transition-all duration-300",
                    selectedTime === time
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              اختر التاريخ أولاً
            </div>
          )}
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-lg font-bold text-primary">
            الموعد المحدد: {format(parseISO(selectedDate), "EEEE d MMMM yyyy", { locale: ar })} - الساعة {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimeStep;
