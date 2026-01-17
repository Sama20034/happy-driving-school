import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const statusConfig: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "قيد الانتظار", icon: Clock, variant: "secondary" },
  confirmed: { label: "تم التأكيد", icon: CheckCircle, variant: "default" },
  shipping: { label: "جاري الشحن", icon: Truck, variant: "default" },
  delivered: { label: "تم التوصيل", icon: CheckCircle, variant: "default" },
  cancelled: { label: "ملغي", icon: XCircle, variant: "destructive" },
};

const MyOrders = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              يجب تسجيل الدخول
            </h2>
            <p className="text-muted-foreground">
              يرجى تسجيل الدخول لعرض طلباتك
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">طلباتي</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                لا توجد طلبات
              </h2>
              <p className="text-muted-foreground">
                لم تقم بأي طلبات بعد
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          طلب #{order.id.slice(0, 8)}
                        </CardTitle>
                        <Badge variant={status.variant}>
                          <StatusIcon className="ml-1 h-4 w-4" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), "dd MMMM yyyy - hh:mm a", {
                          locale: ar,
                        })}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.order_items?.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.product_name} × {item.quantity}
                              </span>
                              <span>{item.unit_price * item.quantity} ج.م</span>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">العنوان</p>
                            <p className="font-medium">{order.customer_address}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">رقم الهاتف</p>
                            <p className="font-medium">{order.customer_phone}</p>
                          </div>
                        </div>

                        <Separator />

                        {/* Total */}
                        <div className="flex justify-between font-bold">
                          <span>الإجمالي</span>
                          <span className="text-primary">
                            {order.total_amount} ج.م
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MyOrders;
