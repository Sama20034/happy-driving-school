import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Eye, Clock, CheckCircle, XCircle, Truck, Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";

const statusConfig: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "قيد الانتظار", icon: Clock, variant: "secondary" },
  confirmed: { label: "تم التأكيد", icon: CheckCircle, variant: "default" },
  shipping: { label: "جاري الشحن", icon: Truck, variant: "default" },
  delivered: { label: "تم التوصيل", icon: CheckCircle, variant: "default" },
  cancelled: { label: "ملغي", icon: XCircle, variant: "destructive" },
};

const StoreOrders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Enable order notifications with sound
  useOrderNotifications({ enabled: notificationsEnabled });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("تم تحديث حالة الطلب");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلبات المتجر</h1>
          <p className="text-muted-foreground">إدارة ومتابعة الطلبات</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Toggle */}
          <Button
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setNotificationsEnabled(!notificationsEnabled);
              toast.success(notificationsEnabled ? "تم إيقاف الإشعارات" : "تم تفعيل الإشعارات");
            }}
            className="flex items-center gap-2"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-4 w-4" />
                الإشعارات مفعلة
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                الإشعارات متوقفة
              </>
            )}
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطلبات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="confirmed">تم التأكيد</SelectItem>
              <SelectItem value="shipping">جاري الشحن</SelectItem>
              <SelectItem value="delivered">تم التوصيل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            الطلبات ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              جاري التحميل...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد طلبات
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.customer_name}
                      </TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>{order.total_amount} ج.م</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-36">
                            <Badge variant={status.variant}>
                              <StatusIcon className="ml-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">قيد الانتظار</SelectItem>
                            <SelectItem value="confirmed">تم التأكيد</SelectItem>
                            <SelectItem value="shipping">جاري الشحن</SelectItem>
                            <SelectItem value="delivered">تم التوصيل</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(order.created_at), "dd/MM/yyyy", {
                          locale: ar,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">اسم العميل</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">رقم الهاتف</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">العنوان</p>
                  <p className="font-medium">{selectedOrder.customer_address}</p>
                </div>
                {selectedOrder.customer_notes && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">ملاحظات</p>
                    <p className="font-medium">{selectedOrder.customer_notes}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium">المنتجات</p>
                {selectedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>{item.unit_price * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>الإجمالي</span>
                <span className="text-primary">{selectedOrder.total_amount} ج.م</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreOrders;
