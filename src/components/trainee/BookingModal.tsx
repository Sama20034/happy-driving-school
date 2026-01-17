import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

interface Captain {
  id: string;
  user_id: string;
  full_name: string;
  hourly_rate: number;
}

interface Schedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface BookingModalProps {
  captain: Captain;
  open: boolean;
  onClose: () => void;
}

export const BookingModal = ({ captain, open, onClose }: BookingModalProps) => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    trainee_name: "",
    trainee_phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (open) {
      fetchSchedules();
      fetchBookedSlots();
    }
  }, [open, captain.id]);

  useEffect(() => {
    if (selectedDate) {
      const dayOfWeek = selectedDate.getDay();
      const daySchedule = schedules.find((s) => s.day_of_week === dayOfWeek && s.is_active);
      
      if (daySchedule) {
        const times = generateTimeSlots(daySchedule.start_time, daySchedule.end_time);
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const bookedForDate = bookedSlots[dateStr] || [];
        const availableTimes = times.filter((time) => !bookedForDate.includes(time));
        setAvailableTimes(availableTimes);
      } else {
        setAvailableTimes([]);
      }
      setSelectedTime("");
    }
  }, [selectedDate, schedules, bookedSlots]);

  const fetchSchedules = async () => {
    const { data } = await supabase
      .from("captain_schedule")
      .select("*")
      .eq("captain_id", captain.id)
      .eq("is_active", true);
    if (data) setSchedules(data);
  };

  const fetchBookedSlots = async () => {
    const { data } = await supabase
      .from("captain_bookings")
      .select("booking_date, booking_time")
      .eq("captain_id", captain.id)
      .in("status", ["pending", "confirmed"]);

    if (data) {
      const slots: Record<string, string[]> = {};
      data.forEach((booking) => {
        if (!slots[booking.booking_date]) {
          slots[booking.booking_date] = [];
        }
        slots[booking.booking_date].push(booking.booking_time);
      });
      setBookedSlots(slots);
    }
  };

  const generateTimeSlots = (start: string, end: string): string[] => {
    const times: string[] = [];
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      times.push(`${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`);
      currentHour += 1;
    }
    
    return times;
  };

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    return schedules.some((s) => s.day_of_week === dayOfWeek && s.is_active);
  };

  const handleSubmit = async () => {
    if (!user || !selectedDate || !selectedTime) {
      toast.error("يرجى اختيار التاريخ والوقت");
      return;
    }

    if (!formData.trainee_name || !formData.trainee_phone) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("captain_bookings")
        .insert({
          captain_id: captain.id,
          trainee_id: user.id,
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          booking_time: selectedTime,
          duration_minutes: 60,
          total_price: captain.hourly_rate,
          trainee_name: formData.trainee_name,
          trainee_phone: formData.trainee_phone,
          notes: formData.notes,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create notification for captain
      await supabase.from("notifications").insert({
        user_id: captain.user_id,
        title: "طلب حجز جديد",
        message: `${formData.trainee_name} يريد الحجز معك يوم ${format(selectedDate, "EEEE، d MMMM", { locale: ar })} الساعة ${selectedTime}`,
        type: "booking",
        related_id: booking.id,
      });

      toast.success("تم إرسال طلب الحجز بنجاح");
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("حدث خطأ أثناء إرسال طلب الحجز");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>حجز موعد مع {captain.full_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              اختر التاريخ
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => !isDateAvailable(date)}
              className="rounded-md border mx-auto"
            />
          </div>

          {selectedDate && availableTimes.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                اختر الوقت
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && availableTimes.length === 0 && (
            <p className="text-center text-muted-foreground">
              لا توجد مواعيد متاحة في هذا اليوم
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسمك الكامل</Label>
              <Input
                value={formData.trainee_name}
                onChange={(e) => setFormData({ ...formData, trainee_name: e.target.value })}
                placeholder="أدخل اسمك"
              />
            </div>

            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input
                value={formData.trainee_phone}
                onChange={(e) => setFormData({ ...formData, trainee_phone: e.target.value })}
                placeholder="أدخل رقم هاتفك"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>ملاحظات (اختياري)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أي ملاحظات تريد إضافتها..."
                rows={3}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>السعر الإجمالي:</span>
              <span className="font-bold text-lg">{captain.hourly_rate} جنيه</span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !selectedDate || !selectedTime}
          >
            {loading ? "جاري الإرسال..." : "تأكيد الحجز"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
