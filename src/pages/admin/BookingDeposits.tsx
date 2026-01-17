import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  CreditCard, 
  Calendar, 
  User, 
  Phone, 
  Loader2, 
  Check, 
  X, 
  Eye,
  Smartphone,
  Clock,
  DollarSign
} from "lucide-react";

interface Booking {
  id: string;
  trainee_id: string;
  trainee_name: string;
  trainee_phone: string;
  booking_date: string;
  booking_time: string;
  total_price: number;
  deposit_amount: number;
  deposit_image_url: string | null;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  captain_id: string;
  captain_profiles: {
    full_name: string;
    user_id: string;
  } | null;
}

const BookingDeposits = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("captain_bookings")
        .select(`
          *,
          captain_profiles (full_name, user_id)
        `)
        .not("deposit_image_url", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (booking: Booking, status: "verified" | "rejected") => {
    setActionLoading(true);
    try {
      // Update payment status
      const { error } = await supabase
        .from("captain_bookings")
        .update({ 
          payment_status: status,
          status: status === "verified" ? "confirmed" : "rejected"
        })
        .eq("id", booking.id);

      if (error) throw error;

      // Send notifications to trainee and captain
      const notifications = [
        {
          user_id: booking.trainee_id,
          title: status === "verified" ? "تم تأكيد الديبوزت" : "تم رفض الديبوزت",
          message: status === "verified" 
            ? "تم تأكيد الديبوزت الخاص بك. يمكنك الآن بدء المحادثة مع الكابتن."
            : "للأسف تم رفض الديبوزت. يرجى التواصل مع الدعم.",
          type: "booking",
          related_id: booking.id,
        }
      ];

      // Add notification for captain if they have user_id
      if (booking.captain_profiles?.user_id) {
        notifications.push({
          user_id: booking.captain_profiles.user_id,
          title: status === "verified" ? "حجز جديد مؤكد" : "تم رفض حجز",
          message: status === "verified" 
            ? `تم تأكيد حجز ${booking.trainee_name}. يمكنك الآن بدء المحادثة.`
            : `تم رفض حجز ${booking.trainee_name}.`,
          type: "booking",
          related_id: booking.id,
        });
      }

      await supabase.from("notifications").insert(notifications);

      // If verified, create chat conversation
      if (status === "verified") {
        // Check if conversation already exists
        const { data: existingConversation } = await supabase
          .from("chat_conversations")
          .select("id")
          .eq("booking_id", booking.id)
          .single();

        if (!existingConversation) {
          await supabase.from("chat_conversations").insert({
            booking_id: booking.id,
            captain_id: booking.captain_id,
            trainee_id: booking.trainee_id,
          });
        }
      }
      
      toast.success(status === "verified" ? "تم التحقق من الدفع وبدء المحادثة" : "تم رفض الدفع");
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setActionLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "في الانتظار", className: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" },
      paid: { label: "مدفوع", className: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
      verified: { label: "تم التحقق", className: "bg-green-500/20 text-green-600 border-green-500/30" },
      rejected: { label: "مرفوض", className: "bg-red-500/20 text-red-600 border-red-500/30" },
    };
    const { label, className } = variants[status] || { label: status, className: "" };
    return <Badge className={className}>{label}</Badge>;
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method === "instapay") return <CreditCard className="h-4 w-4" />;
    return <Smartphone className="h-4 w-4" />;
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.payment_status === filter;
  });

  const pendingCount = bookings.filter((b) => b.payment_status === "paid").length;

  return (
    <>
      <Helmet>
        <title>إدارة الديبوزت | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الديبوزت</h1>
            <p className="text-muted-foreground">
              مراجعة صور التحويلات والتحقق منها
              {pendingCount > 0 && (
                <span className="mr-2 text-primary font-semibold">
                  ({pendingCount} في انتظار التحقق)
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "paid", "verified", "rejected"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "الكل" : 
                 status === "paid" ? "في الانتظار" :
                 status === "verified" ? "تم التحقق" : "مرفوض"}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد حجوزات بديبوزت</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {booking.trainee_name}
                    </CardTitle>
                    {getPaymentStatusBadge(booking.payment_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Deposit Image Thumbnail */}
                  {booking.deposit_image_url && (
                    <img
                      src={booking.deposit_image_url}
                      alt="Deposit receipt"
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setPreviewImage(booking.deposit_image_url)}
                    />
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span dir="ltr">{booking.trainee_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(booking.booking_date), "d MMMM yyyy", { locale: ar })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{booking.booking_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(booking.payment_method)}
                      <span>{booking.payment_method === "instapay" ? "انستا باي" : "فودافون كاش"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{booking.deposit_amount} جنيه</span>
                    </div>
                  </div>

                  {booking.captain_profiles && (
                    <p className="text-sm text-muted-foreground border-t pt-2">
                      الكابتن: {booking.captain_profiles.full_name}
                    </p>
                  )}

                  {booking.payment_status === "paid" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updatePaymentStatus(booking, "verified")}
                        disabled={actionLoading}
                      >
                        <Check className="h-4 w-4 ml-1" />
                        تأكيد
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => updatePaymentStatus(booking, "rejected")}
                        disabled={actionLoading}
                      >
                        <X className="h-4 w-4 ml-1" />
                        رفض
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>عرض صورة الإيصال</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Deposit receipt" 
              className="w-full h-full max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز والديبوزت</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 mt-4">
              {selectedBooking.deposit_image_url && (
                <img
                  src={selectedBooking.deposit_image_url}
                  alt="Deposit receipt"
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => setPreviewImage(selectedBooking.deposit_image_url)}
                />
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">اسم المتدرب</p>
                  <p className="font-semibold">{selectedBooking.trainee_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">رقم الهاتف</p>
                  <p className="font-semibold" dir="ltr">{selectedBooking.trainee_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">التاريخ</p>
                  <p className="font-semibold">
                    {format(new Date(selectedBooking.booking_date), "EEEE، d MMMM yyyy", { locale: ar })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">الوقت</p>
                  <p className="font-semibold">{selectedBooking.booking_time}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">طريقة الدفع</p>
                  <p className="font-semibold flex items-center gap-2">
                    {getPaymentMethodIcon(selectedBooking.payment_method)}
                    {selectedBooking.payment_method === "instapay" ? "انستا باي" : "فودافون كاش"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">حالة الدفع</p>
                  {getPaymentStatusBadge(selectedBooking.payment_status)}
                </div>
                <div>
                  <p className="text-muted-foreground">مبلغ الديبوزت</p>
                  <p className="font-semibold text-primary">{selectedBooking.deposit_amount} جنيه</p>
                </div>
                <div>
                  <p className="text-muted-foreground">السعر الإجمالي</p>
                  <p className="font-semibold">{selectedBooking.total_price} جنيه</p>
                </div>
              </div>

              {selectedBooking.captain_profiles && (
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm">الكابتن</p>
                  <p className="font-semibold">{selectedBooking.captain_profiles.full_name}</p>
                </div>
              )}

              {selectedBooking.payment_status === "paid" && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => updatePaymentStatus(selectedBooking, "verified")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Check className="h-4 w-4 ml-2" />}
                    تأكيد الدفع
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updatePaymentStatus(selectedBooking, "rejected")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <X className="h-4 w-4 ml-2" />}
                    رفض الدفع
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingDeposits;
