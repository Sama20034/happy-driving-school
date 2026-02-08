import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, MapPin, User, Clock, BookOpen, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CertificateModal from "@/components/certificate/CertificateModal";

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  governorates: { name: string } | null;
  branches: { name: string; address: string | null } | null;
  courses: { title: string; price: number; sessions: number } | null;
  captains: { name: string; image_url: string | null } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-600 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-600 border-blue-500/30",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        governorates(name),
        branches(name, address),
        courses(title, price, sessions),
        captains(name, image_url)
      `)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .eq("user_id", user?.id);

    if (error) {
      toast.error("حدث خطأ أثناء إلغاء الحجز");
    } else {
      toast.success("تم إلغاء الحجز بنجاح");
      fetchBookings();
    }
    
    setCancellingId(null);
  };

  const canCancel = (status: string) => {
    return status === "pending" || status === "confirmed";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>حجوزاتي | كابتن مصر</title>
        <meta name="description" content="عرض حجوزاتك السابقة والحالية" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">حجوزاتي</h1>
              <p className="text-muted-foreground">عرض جميع حجوزاتك السابقة والحالية</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">لا توجد حجوزات</h2>
                <p className="text-muted-foreground mb-6">لم تقم بأي حجوزات بعد</p>
                <button
                  onClick={() => navigate("/booking")}
                  className="gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-medium"
                >
                  احجز الآن
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        {booking.captains?.image_url ? (
                          <img
                            src={booking.captains.image_url}
                            alt={booking.captains.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg">{booking.courses?.title}</h3>
                          <p className="text-muted-foreground">
                            {booking.captains?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusColors[booking.status]} border`}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{booking.booking_date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{booking.booking_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{booking.branches?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{booking.courses?.sessions} حصص</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          تم الحجز: {new Date(booking.created_at).toLocaleDateString("ar-EG")}
                        </span>
                        {canCancel(booking.status) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={cancellingId === booking.id}
                              >
                                <XCircle className="h-4 w-4 ml-1" />
                                إلغاء الحجز
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد إلغاء الحجز</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>تراجع</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  نعم، إلغاء الحجز
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {/* Certificate Button for Completed Bookings */}
                        {booking.status === "completed" && (
                          <CertificateModal defaultName={booking.customer_name} />
                        )}
                      </div>
                      <span className="font-bold text-primary text-lg">
                        {booking.courses?.price} جنيه
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default MyBookings;
