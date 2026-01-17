import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Check, X, MessageSquare } from "lucide-react";
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
}

interface CaptainBookingsProps {
  captainId: string;
}

export const CaptainBookings = ({ captainId }: CaptainBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

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
      setBookings(data || []);
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{booking.trainee_name}</span>
                      {getStatusBadge(booking.status)}
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
                    <div className="text-sm">
                      <span className="text-muted-foreground">السعر: </span>
                      <span className="font-semibold">{booking.total_price} جنيه</span>
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {booking.notes}
                      </p>
                    )}
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, "confirmed", booking.trainee_id, booking.trainee_name)}
                        className="gap-1"
                      >
                        <Check className="h-4 w-4" />
                        تأكيد
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, "rejected", booking.trainee_id, booking.trainee_name)}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        رفض
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
