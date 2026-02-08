import { useState, useEffect } from "react";
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
import { Calendar, Clock, User, Phone, Check, X, MessageSquare, Image, CreditCard, Smartphone, Banknote } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Booking {
  id: string;
  captain_id: string;
  trainee_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  total_price: number;
  trainee_name: string;
  trainee_phone: string;
  notes: string;
  created_at: string;
  deposit_image_url: string | null;
  deposit_amount: number | null;
  payment_method: string | null;
  payment_status: string | null;
  captain_confirmed_payment?: boolean;
  captain_confirmed_at?: string | null;
  trainee_confirmed_payment?: boolean;
  trainee_confirmed_at?: string | null;
}

interface CaptainBookingsProps {
  captainId: string;
}

export const CaptainBookings = ({ captainId }: CaptainBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel("captain_bookings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "captain_bookings",
          filter: `captain_id=eq.${captainId}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [captainId]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("captain_bookings")
        .select("*")
        .eq("captain_id", captainId)
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: false });

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBookings((data as any) || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, traineeId: string, traineeName: string) => {
    try {
      const { error } = await supabase
        .from("captain_bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      // Create notification for trainee
      await supabase.from("notifications").insert({
        user_id: traineeId,
        title: status === "confirmed" ? "تم تأكيد حجزك" : "تم رفض حجزك",
        message: status === "confirmed" 
          ? "تم تأكيد حجزك مع الكابتن. يمكنك الآن بدء المحادثة."
          : "للأسف تم رفض حجزك. يمكنك الحجز مع كابتن آخر.",
        type: "booking",
        related_id: bookingId,
      });

      // If confirmed, create chat conversation
      if (status === "confirmed") {
        const { data: captainProfile } = await supabase
          .from("captain_profiles")
          .select("user_id")
          .eq("id", captainId)
          .single();

        if (captainProfile) {
          await supabase.from("chat_conversations").insert({
            booking_id: bookingId,
            captain_id: captainId,
            trainee_id: traineeId,
          });
        }
      }

      toast.success(status === "confirmed" ? "تم تأكيد الحجز" : "تم رفض الحجز");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("حدث خطأ أثناء تحديث الحجز");
    }
  };

  const confirmPaymentReceived = async (booking: Booking) => {
    try {
      const remainingAmount = booking.total_price - (booking.deposit_amount || 0);
      
      const { error } = await supabase
        .from("captain_bookings")
        .update({ 
          captain_confirmed_payment: true,
          captain_confirmed_at: new Date().toISOString(),
          status: "completed"
        })
        .eq("id", booking.id);

      if (error) throw error;

      // Create notification for trainee
      await supabase.from("notifications").insert({
        user_id: booking.trainee_id,
        title: "الكابتن أكد استلام المبلغ",
        message: `الكابتن أكد استلام المبلغ المتبقي (${remainingAmount} جنيه). يرجى تأكيد الدفع من جانبك.`,
        type: "payment",
        related_id: booking.id,
      });

      // Notify all admins
      const { data: admins } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (admins) {
        for (const admin of admins) {
          await supabase.from("notifications").insert({
            user_id: admin.user_id,
            title: "تأكيد استلام دفعة",
            message: `الكابتن أكد استلام ${remainingAmount} جنيه من ${booking.trainee_name}`,
            type: "payment",
            related_id: booking.id,
          });
        }
      }

      toast.success("تم تأكيد استلام المبلغ");
      fetchBookings();
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("حدث خطأ أثناء تأكيد الاستلام");
    }
  };

  const getStatusBadge = (booking: Booking) => {
    // If payment is not verified yet, show waiting for admin
    if (booking.payment_status === "paid") {
      return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">في انتظار تأكيد الأدمن</Badge>;
    }
    if (booking.payment_status === "rejected") {
      return <Badge variant="destructive">مرفوض من الأدمن</Badge>;
    }
    if (booking.payment_status === "verified" && booking.status === "pending") {
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">تم التأكيد - جاهز للتدريب</Badge>;
    }
    
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "في الانتظار", variant: "secondary" },
      confirmed: { label: "مؤكد", variant: "default" },
      rejected: { label: "مرفوض", variant: "destructive" },
      completed: { label: "مكتمل", variant: "outline" },
      cancelled: { label: "ملغي", variant: "destructive" },
    };
    const { label, variant } = variants[booking.status] || { label: booking.status, variant: "secondary" };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            طلبات الحجز
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "confirmed", "completed"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "الكل" : 
                 status === "pending" ? "في الانتظار" :
                 status === "confirmed" ? "مؤكد" : "مكتمل"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد حجوزات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  {/* Deposit Image */}
                  {booking.deposit_image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={booking.deposit_image_url}
                        alt="صورة الديبوزت"
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border"
                        onClick={() => setPreviewImage(booking.deposit_image_url)}
                      />
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {booking.payment_method === "instapay" ? (
                          <><CreditCard className="h-3 w-3" /> انستا باي</>
                        ) : (
                          <><Smartphone className="h-3 w-3" /> فودافون كاش</>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{booking.trainee_name}</span>
                      {getStatusBadge(booking)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span dir="ltr">{booking.trainee_phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(booking.booking_date), "EEEE، d MMMM yyyy", { locale: ar })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.booking_time}</span>
                      </div>
                    </div>
                    <div className="text-sm flex items-center gap-4">
                      <div>
                        <span className="text-muted-foreground">السعر: </span>
                        <span className="font-semibold">{booking.total_price} جنيه</span>
                      </div>
                      {booking.deposit_amount && (
                        <div className="text-primary">
                          <span className="text-muted-foreground">الديبوزت: </span>
                          <span className="font-semibold">{booking.deposit_amount} جنيه</span>
                        </div>
                      )}
                      {booking.deposit_amount && (
                        <div className="text-green-600">
                          <span className="text-muted-foreground">المتبقي: </span>
                          <span className="font-semibold">{booking.total_price - booking.deposit_amount} جنيه</span>
                        </div>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {booking.notes}
                      </p>
                    )}

                    {/* Payment Confirmation Status */}
                    {(booking.captain_confirmed_payment || booking.trainee_confirmed_payment) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {booking.captain_confirmed_payment && (
                          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                            <Check className="h-3 w-3 ml-1" />
                            أنت أكدت الاستلام
                          </Badge>
                        )}
                        {booking.trainee_confirmed_payment && (
                          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                            <Check className="h-3 w-3 ml-1" />
                            المتدرب أكد الدفع
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Show message based on payment status */}
                  <div className="flex flex-col gap-2 items-end">
                    {booking.payment_status === "paid" && (
                      <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                        ⏳ في انتظار تأكيد الديبوزت من الأدمن
                      </p>
                    )}
                    {booking.payment_status === "rejected" && (
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        ❌ تم رفض الديبوزت من الأدمن
                      </p>
                    )}
                    {booking.payment_status === "verified" && booking.status === "confirmed" && !booking.captain_confirmed_payment && (
                      <Button
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        onClick={() => confirmPaymentReceived(booking)}
                      >
                        <Banknote className="h-4 w-4" />
                        تأكيد استلام المبلغ
                      </Button>
                    )}
                    {booking.payment_status === "verified" && booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => {
                          window.location.href = `/chat/${booking.id}`;
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        فتح المحادثة
                      </Button>
                    )}
                    {booking.captain_confirmed_payment && booking.trainee_confirmed_payment && (
                      <Badge className="bg-green-500 text-white">
                        <Check className="h-3 w-3 ml-1" />
                        تم التوثيق من الطرفين
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>عرض صورة الديبوزت</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="صورة الديبوزت" 
              className="w-full h-full max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
