import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { User, Phone, FileText, CreditCard, MessageCircle, Check, Copy, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookingData } from "@/types/booking";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutStepProps {
  bookingData: BookingData;
  onUpdateCustomer: (name: string, phone: string, notes: string) => void;
  onConfirm: () => void;
}

const WHATSAPP_NUMBER = "201220501299";
const INSTAPAY_NUMBER = "01220501299";
const INSTAPAY_NAME = "safia";
const WALLET_NUMBER = "01287871212";
const WALLET_NAME = "صفية احمد";

const CheckoutStep = ({ bookingData, onUpdateCustomer, onConfirm }: CheckoutStepProps) => {
  const { user } = useAuth();
  const [name, setName] = useState(bookingData.customerName);
  const [phone, setPhone] = useState(bookingData.customerPhone);
  const [notes, setNotes] = useState(bookingData.customerNotes);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "whatsapp">("wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    toast.success("تم نسخ الرقم");
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleWhatsAppOrder = async (isPaid: boolean = false) => {
    if (!name.trim() || !phone.trim()) {
      toast.error("من فضلك أدخل الاسم ورقم الموبايل");
      return;
    }

    // Save booking to database first
    await saveBookingToDatabase();

    const bookingDateText = bookingData.date 
      ? format(parseISO(bookingData.date), "EEEE d MMMM yyyy", { locale: ar })
      : "سيتم التنسيق لاحقاً";
    const bookingTimeText = bookingData.time || "سيتم التنسيق لاحقاً";

    const message = `🚗 *طلب حجز جديد*

👤 *بيانات العميل:*
الاسم: ${name}
الموبايل: ${phone}

📍 *تفاصيل الحجز:*
الدولة: ${bookingData.countryName}
المحافظة: ${bookingData.governorateName}
الفرع: ${bookingData.branchName}
الكورس: ${bookingData.courseName}
عدد الحصص: ${bookingData.courseSessions}
الكابتن: ${bookingData.captainName}
الموعد: ${bookingDateText} - ${bookingTimeText}

💰 *المبلغ المطلوب:* ${bookingData.coursePrice} جنيه

${isPaid ? "✅ *تم الدفع عبر المحفظة/انستاباي*" : "💳 *في انتظار التأكيد*"}

📝 *ملاحظات:* ${notes || "لا يوجد"}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const saveBookingToDatabase = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return false;
    }

    setIsSubmitting(true);
    
    // Use current date and "متاح" as default time when no date/time step exists
    const bookingDate = bookingData.date || new Date().toISOString().split('T')[0];
    const bookingTime = bookingData.time || "متاح";
    
    const { error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        governorate_id: bookingData.governorateId,
        branch_id: bookingData.branchId,
        course_id: bookingData.courseId,
        captain_id: bookingData.captainId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        customer_name: name,
        customer_phone: phone,
        customer_notes: notes || null,
        status: "pending"
      });

    setIsSubmitting(false);

    if (error) {
      console.error("Booking error:", error);
      toast.error("حدث خطأ أثناء الحجز");
      return false;
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("من فضلك أدخل الاسم ورقم الموبايل");
      return;
    }
    
    const success = await saveBookingToDatabase();
    if (success) {
      onUpdateCustomer(name, phone, notes);
      onConfirm();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">إتمام الحجز</h2>
        <p className="text-muted-foreground">أكمل بياناتك واختر طريقة الدفع</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="text-primary" size={20} />
              بياناتك
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">رقم الموبايل *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="mt-1"
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات تريد إضافتها..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="text-primary" size={20} />
              طريقة الدفع
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("wallet")}
                className={`w-full p-4 rounded-xl border-2 text-right transition-all ${
                  paymentMethod === "wallet"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <CreditCard className="text-accent" size={20} />
                    </div>
                    <div>
                      <p className="font-bold">تحويل محفظة / انستا باي</p>
                      <p className="text-sm text-muted-foreground">فودافون كاش - اتصالات كاش - انستا باي</p>
                    </div>
                  </div>
                  {paymentMethod === "wallet" && (
                    <Check className="text-primary" size={20} />
                  )}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("whatsapp")}
                className={`w-full p-4 rounded-xl border-2 text-right transition-all ${
                  paymentMethod === "whatsapp"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <MessageCircle className="text-accent-foreground" size={20} />
                    </div>
                    <div>
                      <p className="font-bold">الدفع عبر واتساب</p>
                      <p className="text-sm text-muted-foreground">تواصل مع الأدمن مباشرة</p>
                    </div>
                  </div>
                  {paymentMethod === "whatsapp" && (
                    <Check className="text-primary" size={20} />
                  )}
                </div>
              </button>
            </div>

            {paymentMethod === "wallet" && (
              <div className="mt-4 p-4 bg-muted rounded-xl space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">رقم انستاباي:</p>
                  <div className="flex items-center justify-between bg-background p-2 rounded border">
                    <span className="font-mono font-bold" dir="ltr">{INSTAPAY_NUMBER}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyNumber(INSTAPAY_NUMBER)}
                    >
                      {copiedNumber === INSTAPAY_NUMBER ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">باسم: {INSTAPAY_NAME}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">رقم المحفظة:</p>
                  <div className="flex items-center justify-between bg-background p-2 rounded border">
                    <span className="font-mono font-bold" dir="ltr">{WALLET_NUMBER}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyNumber(WALLET_NUMBER)}
                    >
                      {copiedNumber === WALLET_NUMBER ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">باسم: {WALLET_NAME}</p>
                </div>
                
                <p className="text-sm text-primary text-center font-medium">
                  بعد التحويل، أرسل صورة الإيصال عبر واتساب
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-6 border border-border h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            ملخص الطلب
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">المحافظة</span>
              <span className="font-medium">{bookingData.governorateName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">الفرع</span>
              <span className="font-medium">{bookingData.branchName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">الكورس</span>
              <span className="font-medium">{bookingData.courseName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">عدد الحصص</span>
              <span className="font-medium">{bookingData.courseSessions} حصة</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">الكابتن</span>
              <span className="font-medium">{bookingData.captainName}</span>
            </div>
            {bookingData.date && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">التاريخ</span>
                <span className="font-medium">
                  {format(parseISO(bookingData.date), "d MMMM yyyy", { locale: ar })}
                </span>
              </div>
            )}
            {bookingData.time && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">الساعة</span>
                <span className="font-medium">{bookingData.time}</span>
              </div>
            )}

            <div className="flex justify-between py-4 bg-primary/10 rounded-xl px-4 mt-4">
              <span className="font-bold text-lg">الإجمالي</span>
              <span className="font-bold text-2xl text-primary">
                {bookingData.coursePrice} جنيه
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {paymentMethod === "whatsapp" ? (
              <Button
                onClick={() => handleWhatsAppOrder(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="ml-2 animate-spin" size={20} /> : <MessageCircle className="ml-2" size={20} />}
                إرسال الطلب عبر واتساب
              </Button>
            ) : (
              <Button
                onClick={() => handleWhatsAppOrder(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="ml-2 animate-spin" size={20} /> : <MessageCircle className="ml-2" size={20} />}
                تأكيد الطلب عبر واتساب
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep;
