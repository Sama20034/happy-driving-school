import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Clock, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  governorates: { name: string } | null;
  branches: { name: string } | null;
  courses: { title: string } | null;
  captains: { name: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-600",
  confirmed: "bg-green-500/20 text-green-600",
  cancelled: "bg-red-500/20 text-red-600",
  completed: "bg-blue-500/20 text-blue-600",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        governorates(name),
        branches(name),
        courses(title),
        captains(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("خطأ في تحميل الحجوزات");
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("خطأ في تحديث الحالة");
    } else {
      toast.success("تم تحديث الحالة");
      fetchBookings();
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("خطأ في حذف الحجز");
    } else {
      toast.success("تم حذف الحجز");
      fetchBookings();
    }
  };

  return (
    <>
      <Helmet>
        <title>إدارة الحجوزات | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة الحجوزات</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الحجوزات</p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              لا توجد حجوزات
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الفرع</TableHead>
                  <TableHead className="text-right">الكورس</TableHead>
                  <TableHead className="text-right">الكابتن</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الوقت</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.customer_name}</TableCell>
                    <TableCell dir="ltr" className="text-right">{booking.customer_phone}</TableCell>
                    <TableCell>{booking.branches?.name}</TableCell>
                    <TableCell>{booking.courses?.title}</TableCell>
                    <TableCell>{booking.captains?.name}</TableCell>
                    <TableCell>{booking.booking_date}</TableCell>
                    <TableCell>{booking.booking_time}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status]}>
                        {statusLabels[booking.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-500"
                              onClick={() => updateStatus(booking.id, "confirmed")}
                            >
                              <Check size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500"
                              onClick={() => updateStatus(booking.id, "cancelled")}
                            >
                              <X size={16} />
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-500"
                            onClick={() => updateStatus(booking.id, "completed")}
                          >
                            <Clock size={16} />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteBooking(booking.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
};

export default Bookings;
