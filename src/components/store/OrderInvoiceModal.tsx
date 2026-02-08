import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, MessageCircle, Package, Printer } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_notes?: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: "wallet" | "whatsapp" | "cod";
}

interface OrderInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  order: OrderData | null;
  items: OrderItem[];
  onWhatsAppSend: () => void;
}

const paymentMethodLabels = {
  wallet: "تحويل محفظة / انستاباي",
  cod: "الدفع عند الاستلام",
  whatsapp: "الدفع عبر واتساب",
};

const OrderInvoiceModal = ({ open, onClose, order, items, onWhatsAppSend }: OrderInvoiceModalProps) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto print:max-w-full print:shadow-none">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">تم تأكيد الطلب بنجاح!</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4" id="invoice-content">
          {/* Invoice Header */}
          <div className="text-center bg-primary/5 rounded-lg p-4">
            <h3 className="font-bold text-lg text-primary">فاتورة طلب</h3>
            <p className="text-sm text-muted-foreground mt-1">
              رقم الطلب: <span className="font-mono font-bold">#{order.id.slice(0, 8)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(order.created_at), "dd MMMM yyyy - hh:mm a", { locale: ar })}
            </p>
          </div>

          {/* Customer Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">بيانات العميل</h4>
            <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
              <p><span className="text-muted-foreground">الاسم:</span> {order.customer_name}</p>
              <p><span className="text-muted-foreground">الهاتف:</span> {order.customer_phone}</p>
              <p><span className="text-muted-foreground">العنوان:</span> {order.customer_address}</p>
              {order.customer_notes && (
                <p><span className="text-muted-foreground">ملاحظات:</span> {order.customer_notes}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              المنتجات
            </h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm bg-muted/30 rounded-lg p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {item.price} ج.م
                    </p>
                  </div>
                  <span className="font-bold">{item.price * item.quantity} ج.م</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">طريقة الدفع</span>
            <span className="font-medium">{paymentMethodLabels[order.payment_method]}</span>
          </div>

          {/* Total */}
          <div className="bg-primary text-primary-foreground rounded-lg p-4 flex justify-between items-center">
            <span className="font-bold text-lg">الإجمالي</span>
            <span className="font-bold text-2xl">{order.total_amount} ج.م</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 print:hidden pt-2">
            <Button 
              onClick={onWhatsAppSend}
              className="w-full"
            >
              <MessageCircle className="ml-2 h-4 w-4" />
              إرسال الطلب عبر واتساب
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="w-full"
            >
              <Printer className="ml-2 h-4 w-4" />
              طباعة الفاتورة
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full"
            >
              إغلاق
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground print:hidden">
            سيتم التواصل معك قريباً لتأكيد الطلب
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderInvoiceModal;
