import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, User, X, MessageSquare, Check, Banknote } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
  deposit_amount: number | null;
  payment_status: string | null;
  captain_confirmed_payment?: boolean;
  captain_confirmed_at?: string | null;
  trainee_confirmed_payment?: boolean;
  trainee_confirmed_at?: string | null;
  captain_profiles: {
    full_name: string;
    car_type: string;
    transmission_type: string;
    phone: string;
    user_id: string;
  };
}

interface TraineeBookingsProps {
  userId: string;
}

export const TraineeBookings = ({ userId }: TraineeBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("trainee_bookings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "captain_bookings",
          filter: `trainee_id=eq.${userId}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("captain_bookings")
        .select(`
          *,
          captain_profiles (
            full_name,
            car_type,
            transmission_type,
            phone,
            user_id
          )
        `)
        .eq("trainee_id", userId)
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

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("captain_bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;
      toast.success("تم إلغاء الحجز");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("حدث خطأ أثناء إلغاء الحجز");
    }
  };

  const confirmPayment = async (booking: Booking) => {
    try {
      const remainingAmount = booking.total_price - (booking.deposit_amount || 0);
      
      const { error } = await supabase
        .from("captain_bookings")
        .update({ 
          trainee_confirmed_payment: true,
          trainee_confirmed_at: new Date().toISOString()
        })
        .eq("id", booking.id);

      if (error) throw error;

      // Create notification for captain
      if (booking.captain_profiles?.user_id) {
        await supabase.from("notifications").insert({
          user_id: booking.captain_profiles.user_id,
          title: "المتدرب أكد دفع المبلغ",
          message: `${booking.trainee_name} أكد دفع المبلغ المتبقي (${remainingAmount} جنيه)`,
          type: "payment",
          related_id: booking.id,
        });
      }

      // Notify all admins
      const { data: admins } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (admins) {
        for (const admin of admins) {
          await supabase.from("notifications").insert({
            user_id: admin.user_id,
            title: "تأكيد دفع من متدرب",
            message: `${booking.trainee_name} أكد دفع ${remainingAmount} جنيه للكابتن ${booking.captain_profiles?.full_name}`,
            type: "payment",
            related_id: booking.id,
          });
        }
      }

      toast.success("تم تأكيد الدفع");
      fetchBookings();
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("حدث خطأ أثناء تأكيد الدفع");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "في الانتظار", variant: "secondary" },
      confirmed: { label: "مؤكد", variant: "default" },
      rejected: { label: "مرفوض", variant: "destructive" },
      completed: { label: "مكتمل", variant: "outline" },
      cancelled: { label: "ملغي", variant: "destructive" },
    };
    const { label, variant } = variants[status] || { label: status, variant: "secondary" };
    return <Badge variant={variant}>{label}</Badge>;
  };

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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          حجوزاتي
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد حجوزات حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        كابتن {booking.captain_profiles?.full_name}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(booking.booking_date), "EEEE، d MMMM yyyy", { locale: ar })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.booking_time}</span>
                      </div>
                    </div>
                    {booking.captain_profiles?.car_type && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">السيارة: </span>
                        {booking.captain_profiles.car_type}
                        {booking.captain_profiles.transmission_type && (
                          <Badge variant="secondary" className="mr-2 text-xs">
                            {booking.captain_profiles.transmission_type === "automatic" ? "أوتوماتيك" : "مانيوال"}
                          </Badge>
                        )}
                      </p>
                    )}
                    <div className="text-sm flex flex-wrap gap-4">
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

                    {/* Payment Confirmation Status */}
                    {(booking.captain_confirmed_payment || booking.trainee_confirmed_payment) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {booking.trainee_confirmed_payment && (
                          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                            <Check className="h-3 w-3 ml-1" />
                            أنت أكدت الدفع
                          </Badge>
                        )}
                        {booking.captain_confirmed_payment && (
                          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                            <Check className="h-3 w-3 ml-1" />
                            الكابتن أكد الاستلام
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {booking.status === "confirmed" && !booking.trainee_confirmed_payment && (
                      <Button
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        onClick={() => confirmPayment(booking)}
                      >
                        <Banknote className="h-4 w-4" />
                        تأكيد دفع المبلغ
                      </Button>
                    )}
                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/chat/${booking.id}`)}
                        className="gap-1"
                      >
                        <MessageSquare className="h-4 w-4" />
                        محادثة
                      </Button>
                    )}
                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => cancelBooking(booking.id)}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        إلغاء
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
    </Card>
  );
};
