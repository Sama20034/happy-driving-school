import { useState, useEffect, useRef } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Clock, Calendar as CalendarIcon, Upload, CreditCard, Smartphone, Check, Loader2, GraduationCap } from "lucide-react";

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

interface CoursePrice {
  course_type: string;
  session_price: number;
}

interface BookingModalProps {
  captain: Captain;
  open: boolean;
  onClose: () => void;
  coursePrices?: CoursePrice[];
}

const MIN_SESSION_DEPOSIT = 300; // الحد الأدنى للديبوزيت للحصة
const COURSE_DEPOSIT_PERCENTAGE = 0.30; // 30% للكورس
const DISCOUNT_PERCENTAGE = 0.05; // 5% خصم على الكورسات

const CAPTAIN_COURSE_CONFIG: Record<string, { name: string; sessions: number }> = {
  practice: { name: "كورس الممارسة", sessions: 6 },
  beginner: { name: "كورس المبتدئين", sessions: 8 },
  professional: { name: "كورس الاحتراف", sessions: 10 }
};

export const BookingModal = ({ captain, open, onClose, coursePrices = [] }: BookingModalProps) => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<"session" | "course">("session");
  const [selectedCourseType, setSelectedCourseType] = useState<string>("");
  const [formData, setFormData] = useState({
    trainee_name: "",
    trainee_phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  
  // Deposit/Payment states
  const [step, setStep] = useState<"booking" | "payment">("booking");
  const [paymentMethod, setPaymentMethod] = useState<"instapay" | "vodafone_cash">("instapay");
  const [depositImage, setDepositImage] = useState<File | null>(null);
  const [depositImagePreview, setDepositImagePreview] = useState<string | null>(null);
  const [uploadingDeposit, setUploadingDeposit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate total price and deposit based on booking type
  const selectedCaptainCourse = coursePrices.find(c => c.course_type === selectedCourseType);
  const selectedCourseConfig = selectedCourseType ? CAPTAIN_COURSE_CONFIG[selectedCourseType] : null;
  
  const totalPrice = bookingType === "course" && selectedCaptainCourse && selectedCourseConfig
    ? Math.round(selectedCaptainCourse.session_price * selectedCourseConfig.sessions * (1 - DISCOUNT_PERCENTAGE))
    : captain.hourly_rate;
  
  const depositAmount = bookingType === "course" && selectedCaptainCourse && selectedCourseConfig
    ? Math.round(totalPrice * COURSE_DEPOSIT_PERCENTAGE) // 30% للكورس
    : Math.max(MIN_SESSION_DEPOSIT, Math.round(captain.hourly_rate * 0.5)); // الحد الأدنى 300 للحصة

  useEffect(() => {
    if (open) {
      fetchSchedules();
      fetchBookedSlots();
      // Reset states when modal opens
      setStep("booking");
      setDepositImage(null);
      setDepositImagePreview(null);
      setBookingType("session");
      setSelectedCourseType("");
    }
    
    // Cleanup object URL to prevent memory leak
    return () => {
      if (depositImagePreview) {
        URL.revokeObjectURL(depositImagePreview);
      }
    };
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

  const handleDepositImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار صورة");
        return;
      }
      // Revoke old URL before creating new one to prevent memory leak
      if (depositImagePreview) {
        URL.revokeObjectURL(depositImagePreview);
      }
      setDepositImage(file);
      setDepositImagePreview(URL.createObjectURL(file));
    }
  };

  const proceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("يرجى اختيار التاريخ والوقت");
      return;
    }
    if (bookingType === "course" && !selectedCourseType) {
      toast.error("يرجى اختيار الكورس");
      return;
    }
    if (!formData.trainee_name || !formData.trainee_phone) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف");
      return;
    }
    setStep("payment");
  };

  const handleSubmit = async () => {
    if (!user || !selectedDate || !selectedTime) {
      toast.error("يرجى اختيار التاريخ والوقت");
      return;
    }

    if (!depositImage) {
      toast.error("يرجى رفع صورة إيصال التحويل");
      return;
    }

    setLoading(true);
    setUploadingDeposit(true);

    try {
      // Upload deposit image
      const fileExt = depositImage.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("deposit-images")
        .upload(fileName, depositImage);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("deposit-images")
        .getPublicUrl(fileName);

      // Create booking with deposit info
      const courseName = selectedCourseConfig ? selectedCourseConfig.name : "";
      const courseSessions = selectedCourseConfig ? selectedCourseConfig.sessions : 0;
      const bookingNotes = `${bookingType === "course" && selectedCourseConfig ? `كورس: ${courseName} (${courseSessions} حصص)` : "حصة واحدة"}${formData.notes ? ` - ${formData.notes}` : ""}`;
      
      const { data: booking, error: bookingError } = await supabase
        .from("captain_bookings")
        .insert({
          captain_id: captain.id,
          trainee_id: user.id,
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          booking_time: selectedTime,
          duration_minutes: bookingType === "course" && selectedCourseConfig 
            ? selectedCourseConfig.sessions * 60 
            : 60,
          total_price: totalPrice,
          trainee_name: formData.trainee_name,
          trainee_phone: formData.trainee_phone,
          notes: bookingNotes,
          deposit_amount: depositAmount,
          deposit_image_url: urlData.publicUrl,
          payment_method: paymentMethod,
          payment_status: "paid",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create notification for captain
      const bookingTypeText = bookingType === "course" && selectedCourseConfig 
        ? `كورس ${courseName}` 
        : "حصة";
      await supabase.from("notifications").insert({
        user_id: captain.user_id,
        title: "طلب حجز جديد مع ديبوزت",
        message: `${formData.trainee_name} حجز معك ${bookingTypeText} يوم ${format(selectedDate, "EEEE، d MMMM", { locale: ar })} الساعة ${selectedTime} ودفع ديبوزت ${depositAmount} جنيه`,
        type: "booking",
        related_id: booking.id,
      });

      toast.success("تم إرسال طلب الحجز بنجاح مع صورة الديبوزت");
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("حدث خطأ أثناء إرسال طلب الحجز");
    } finally {
      setLoading(false);
      setUploadingDeposit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {step === "booking" ? `حجز موعد مع ${captain.full_name}` : "دفع الديبوزت"}
          </DialogTitle>
        </DialogHeader>

        {step === "booking" ? (
          <div className="space-y-6 py-4">
            {/* Booking Type Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                نوع الحجز
              </Label>
              <RadioGroup
                value={bookingType}
                onValueChange={(value) => {
                  setBookingType(value as "session" | "course");
                  if (value === "session") setSelectedCourseType("");
                }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="session" id="session" />
                  <Label htmlFor="session" className="cursor-pointer">
                    حصة واحدة
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="course" id="course" />
                  <Label htmlFor="course" className="cursor-pointer">
                    كورس كامل
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Course Selection - Only for course booking */}
            {bookingType === "course" && (
              <div className="space-y-2">
                <Label>اختر الكورس</Label>
                {coursePrices.length > 0 ? (
                  <Select value={selectedCourseType} onValueChange={setSelectedCourseType}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الكورس" />
                    </SelectTrigger>
                    <SelectContent>
                      {coursePrices.map((price) => {
                        const config = CAPTAIN_COURSE_CONFIG[price.course_type];
                        if (!config || price.session_price <= 0) return null;
                        const totalCoursePrice = Math.round(price.session_price * config.sessions * (1 - DISCOUNT_PERCENTAGE));
                        return (
                          <SelectItem key={price.course_type} value={price.course_type}>
                            {config.name} - {config.sessions} حصص - {totalCoursePrice} جنيه
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    هذا الكابتن لم يحدد أسعار الكورسات بعد. يرجى التواصل معه أو اختيار حصة واحدة.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                اختر التاريخ {bookingType === "course" && "(أول حصة)"}
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

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span>السعر الإجمالي:</span>
                <span className="font-bold text-lg">{totalPrice} جنيه</span>
              </div>
              {bookingType === "course" && selectedCourseConfig && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>عدد الحصص:</span>
                  <span>{selectedCourseConfig.sessions} حصص</span>
                </div>
              )}
              {bookingType === "course" && selectedCaptainCourse && selectedCourseConfig && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>خصم 5%:</span>
                  <span>توفير {Math.round(selectedCaptainCourse.session_price * selectedCourseConfig.sessions * DISCOUNT_PERCENTAGE)} جنيه</span>
                </div>
              )}
              <div className="flex justify-between items-center text-primary">
                <span>
                  الديبوزت المطلوب ({bookingType === "course" ? "30%" : `الحد الأدنى ${MIN_SESSION_DEPOSIT} ج`}):
                </span>
                <span className="font-bold text-lg">{depositAmount} جنيه</span>
              </div>
              {bookingType === "course" && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>الباقي بعد إتمام الكورس:</span>
                  <span>{totalPrice - depositAmount} جنيه</span>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={proceedToPayment}
              disabled={!selectedDate || !selectedTime || (bookingType === "course" && !selectedCourseType)}
            >
              متابعة للدفع
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Payment Instructions */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                تعليمات الدفع
              </h3>
              <p className="text-sm">
                قم بتحويل مبلغ <span className="font-bold text-primary">{depositAmount} جنيه</span> كديبوزت باستخدام إحدى الطرق التالية:
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>اختر طريقة الدفع</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "instapay" | "vodafone_cash")}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="instapay" id="instapay" />
                  <Label htmlFor="instapay" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    انستا باي
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="vodafone_cash" id="vodafone_cash" />
                  <Label htmlFor="vodafone_cash" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4" />
                    فودافون كاش
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Details */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              {paymentMethod === "instapay" ? (
                <>
                  <p className="font-semibold">بيانات انستا باي:</p>
                  <p className="text-sm">الاسم: Happy Driving School</p>
                  <p className="text-sm" dir="ltr">IPA: happydriving@instapay</p>
                  <p className="text-sm" dir="ltr">رقم: 01515160511</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">بيانات فودافون كاش:</p>
                  <p className="text-sm" dir="ltr">رقم المحفظة: 01229109991</p>
                </>
              )}
            </div>

            {/* Upload Deposit Image */}
            <div className="space-y-3">
              <Label>رفع صورة إيصال التحويل</Label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleDepositImageChange}
                className="hidden"
              />
              
              {depositImagePreview ? (
                <div className="relative">
                  <img
                    src={depositImagePreview}
                    alt="Deposit receipt"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    تغيير الصورة
                  </Button>
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">اضغط لرفع صورة الإيصال</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>التاريخ:</span>
                <span>{selectedDate && format(selectedDate, "EEEE، d MMMM yyyy", { locale: ar })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>الوقت:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-primary">
                <span>الديبوزت:</span>
                <span>{depositAmount} جنيه</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("booking")} className="flex-1">
                رجوع
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={loading || !depositImage}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  "تأكيد الحجز والدفع"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
