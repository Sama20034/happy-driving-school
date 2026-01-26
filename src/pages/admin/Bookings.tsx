import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Clock, Trash2, CheckCircle, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface CaptainBooking {
  id: string;
  captain_id: string;
  trainee_id: string;
  trainee_name: string;
  trainee_phone: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  total_price: number;
  created_at: string;
  captain_profiles: { full_name: string } | null;
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
  const [captainBookings, setCaptainBookings] = useState<CaptainBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);

    const [courseRes, captainRes] = await Promise.all([
      supabase
        .from("bookings")
        .select(
          `
          *,
          governorates(name),
          branches(name),
          courses(title),
          captains(name)
        `
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("captain_bookings")
        .select(`*, captain_profiles(full_name)`)
        .order("created_at", { ascending: false }),
    ]);

    if (courseRes.error) {
      console.error(courseRes.error);
      toast.error("خطأ في تحميل حجوزات الكورسات");
      setBookings([]);
    } else {
      setBookings(courseRes.data || []);
    }

    if (captainRes.error) {
      console.error(captainRes.error);
      toast.error("خطأ في تحميل حجوزات الكباتن");
      setCaptainBookings([]);
    } else {
      setCaptainBookings((captainRes.data as any) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
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
      fetchAll();
    }
  };

  const updateCaptainBookingStatus = async (booking: CaptainBooking, newStatus: string) => {
    const { error } = await supabase
      .from("captain_bookings")
      .update({ status: newStatus })
      .eq("id", booking.id);

    if (error) {
      toast.error("خطأ في تحديث الحالة");
      return;
    }

    // If completed, add amount to captain wallet
    if (newStatus === "completed") {
      await addToWalletOnCompletion(booking);
    }

    toast.success("تم تحديث الحالة");
    fetchAll();
  };

  const addToWalletOnCompletion = async (booking: CaptainBooking) => {
    try {
      // Check if captain has wallet
      const { data: wallet, error: walletError } = await supabase
        .from("captain_wallets")
        .select("id, balance")
        .eq("captain_id", booking.captain_id)
        .maybeSingle();

      if (walletError) throw walletError;

      if (!wallet) {
        // Create wallet if doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("captain_wallets")
          .insert({ captain_id: booking.captain_id, balance: booking.total_price })
          .select()
          .single();

        if (createError) throw createError;

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Add transaction record
        await supabase.from("wallet_transactions").insert({
          wallet_id: newWallet.id,
          captain_id: booking.captain_id,
          amount: booking.total_price,
          transaction_type: "booking_payment",
          description: `مستحقات حجز - ${booking.trainee_name} - ${booking.booking_date}`,
          created_by: user?.id,
        });
      } else {
        // Update existing wallet
        const newBalance = Number(wallet.balance) + Number(booking.total_price);
        
        const { error: updateError } = await supabase
          .from("captain_wallets")
          .update({ balance: newBalance })
          .eq("id", wallet.id);

        if (updateError) throw updateError;

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Add transaction record
        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          captain_id: booking.captain_id,
          amount: booking.total_price,
          transaction_type: "booking_payment",
          description: `مستحقات حجز - ${booking.trainee_name} - ${booking.booking_date}`,
          created_by: user?.id,
        });
      }

      // Notify captain
      const { data: captainProfile } = await supabase
        .from("captain_profiles")
        .select("user_id")
        .eq("id", booking.captain_id)
        .single();

      if (captainProfile) {
        await supabase.from("notifications").insert({
          user_id: captainProfile.user_id,
          title: "تم إضافة مستحقات حجز للمحفظة",
          message: `تم إضافة ${booking.total_price} جنيه لمحفظتك من حجز ${booking.trainee_name}`,
          type: "wallet",
        });
      }

      toast.success("تم إضافة المبلغ للمحفظة");
    } catch (error) {
      console.error("Error adding to wallet:", error);
      toast.error("خطأ في إضافة المبلغ للمحفظة");
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
      fetchAll();
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
          ) : (
            <Tabs defaultValue="captain" className="p-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="captain">حجوزات الكباتن</TabsTrigger>
                <TabsTrigger value="courses">حجوزات الكورسات</TabsTrigger>
              </TabsList>

              <TabsContent value="captain" className="pt-4">
                {captainBookings.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    لا توجد حجوزات كباتن
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المتدرب</TableHead>
                        <TableHead className="text-right">الهاتف</TableHead>
                        <TableHead className="text-right">الكابتن</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الوقت</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">حالة الدفع</TableHead>
                        <TableHead className="text-right">الإجمالي</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {captainBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.trainee_name}</TableCell>
                          <TableCell dir="ltr" className="text-right">{b.trainee_phone || "-"}</TableCell>
                          <TableCell>{b.captain_profiles?.full_name || "-"}</TableCell>
                          <TableCell>{b.booking_date}</TableCell>
                          <TableCell>{b.booking_time}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                b.status === "completed" ? "bg-green-500/20 text-green-600" :
                                b.status === "confirmed" ? "bg-blue-500/20 text-blue-600" :
                                b.status === "cancelled" ? "bg-red-500/20 text-red-600" :
                                "bg-yellow-500/20 text-yellow-600"
                              }
                            >
                              {b.status === "completed" ? "مكتمل" :
                               b.status === "confirmed" ? "مؤكد" :
                               b.status === "cancelled" ? "ملغي" :
                               "قيد الانتظار"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{b.payment_status}</Badge>
                          </TableCell>
                          <TableCell>{Number(b.total_price || 0).toFixed(0)} جنيه</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {b.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => updateCaptainBookingStatus(b, "completed")}
                                >
                                  <CheckCircle className="h-4 w-4 ml-1" />
                                  اكتمل
                                </Button>
                              )}
                              {b.status === "completed" && (
                                <Badge className="bg-green-500 flex items-center gap-1">
                                  <Wallet className="h-3 w-3" />
                                  تمت الإضافة للمحفظة
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="courses" className="pt-4">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">لا توجد حجوزات كورسات</div>
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
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
};

export default Bookings;
