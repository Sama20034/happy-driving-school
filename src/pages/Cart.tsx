import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package, MessageCircle, Wallet, Copy, Check, Truck, Loader2, CheckCircle } from "lucide-react";
import { useCart, CartItem } from "@/hooks/useCart";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import OrderInvoiceModal from "@/components/store/OrderInvoiceModal";

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

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "whatsapp" | "cod">("wallet");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);

  const WHATSAPP_NUMBER = "201515160511";
  const INSTAPAY_NUMBER = "01229109991";
  const INSTAPAY_NAME = "كابتن مصر";
  const WALLET_NUMBER = "01229109991";
  const WALLET_NAME = "كابتن مصر";

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    toast.success("تم نسخ الرقم");
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const saveOrderToDatabase = async () => {
    try {
      // Create the order - user_id is optional for guest checkout
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_notes: formData.notes || null,
          total_amount: getTotalPrice(),
          status: "pending"
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order error:", orderError);
        throw orderError;
      }

      // Create order items
      const orderItemsData = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) {
        console.error("Order items error:", itemsError);
        throw itemsError;
      }

      return orderData;
    } catch (error) {
      console.error("Failed to save order:", error);
      throw error;
    }
  };

  const sendWhatsAppMessage = (order: OrderData | null, orderItemsList: CartItem[]) => {
    const itemsList = orderItemsList
      .map((item) => `• ${item.name} (${item.quantity} × ${item.price} ج.م) = ${item.price * item.quantity} ج.م`)
      .join("\n");

    const paymentStatus = paymentMethod === "wallet"
      ? "✅ *تم الدفع عبر المحفظة/انستاباي*" 
      : paymentMethod === "cod"
        ? "💵 *الدفع عند الاستلام*"
        : "💳 *في انتظار التأكيد*";

    const orderIdText = order ? `\n📋 *رقم الطلب:* #${order.id.slice(0, 8)}` : "";

    const message = `🛒 *طلب جديد من المتجر*${orderIdText}

👤 *بيانات العميل:*
الاسم: ${formData.name}
الهاتف: ${formData.phone}
العنوان: ${formData.address}
${formData.notes ? `ملاحظات: ${formData.notes}` : ""}

📦 *المنتجات:*
${itemsList}

💰 *الإجمالي: ${getTotalPrice()} ج.م*

${paymentStatus}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("يرجى ملء جميع البيانات المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to database
      const savedOrder = await saveOrderToDatabase();
      
      if (savedOrder) {
        // Store items before clearing cart
        setOrderItems([...items]);
        
        // Create order data with payment method
        const orderData: OrderData = {
          ...savedOrder,
          payment_method: paymentMethod,
        };
        
        setCompletedOrder(orderData);
        setShowInvoice(true);
        
        // Clear cart
        clearCart();
        toast.success("تم تأكيد الطلب بنجاح!");
      }
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    setCompletedOrder(null);
    setOrderItems([]);
    navigate("/my-orders");
  };

  const handleWhatsAppFromInvoice = () => {
    sendWhatsAppMessage(completedOrder, orderItems);
  };

  if (items.length === 0 && !showInvoice) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                السلة فارغة
              </h2>
              <p className="text-muted-foreground mb-6">
                لم تقم بإضافة أي منتجات إلى السلة بعد
              </p>
              <Link to="/store">
                <Button>
                  <Package className="ml-2 h-4 w-4" />
                  تصفح المتجر
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/store">
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">سلة المشتريات</h1>
              <p className="text-muted-foreground mt-1">
                {items.length} منتج في السلة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold">
                          {item.price} ج.م
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold">
                          {item.price * item.quantity} ج.م
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Checkout Form */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>إتمام الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="ملاحظات إضافية على الطلب..."
                      />
                    </div>

                    <Separator />

                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        طريقة الدفع
                      </Label>
                      
                      {/* Wallet/InstaPay Option */}
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === "wallet"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("wallet")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "wallet" ? "border-primary" : "border-muted-foreground"
                            }`}>
                              {paymentMethod === "wallet" && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">تحويل محفظة / انستاباي</p>
                              <p className="text-sm text-muted-foreground">فودافون كاش - اتصالات كاش - انستاباي</p>
                            </div>
                          </div>
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {/* Cash on Delivery Option */}
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"
                            }`}>
                              {paymentMethod === "cod" && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">الدفع عند الاستلام</p>
                              <p className="text-sm text-muted-foreground">ادفع نقداً عند استلام الطلب</p>
                            </div>
                          </div>
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {/* WhatsApp Option */}
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === "whatsapp"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("whatsapp")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "whatsapp" ? "border-primary" : "border-muted-foreground"
                            }`}>
                              {paymentMethod === "whatsapp" && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">الدفع عبر واتساب</p>
                              <p className="text-sm text-muted-foreground">تواصل مع الأدمن مباشرة</p>
                            </div>
                          </div>
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {/* Payment Details for Wallet */}
                      {paymentMethod === "wallet" && (
                        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">رقم انستاباي:</p>
                            <div className="flex items-center justify-between bg-background p-2 rounded border">
                              <span className="font-mono font-bold">{INSTAPAY_NUMBER}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopyNumber(INSTAPAY_NUMBER)}
                              >
                                {copiedNumber === INSTAPAY_NUMBER ? (
                                  <Check className="h-4 w-4 text-primary" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">باسم: {INSTAPAY_NAME}</p>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">رقم المحفظة:</p>
                            <div className="flex items-center justify-between bg-background p-2 rounded border">
                              <span className="font-mono font-bold">{WALLET_NUMBER}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopyNumber(WALLET_NUMBER)}
                              >
                                {copiedNumber === WALLET_NUMBER ? (
                                  <Check className="h-4 w-4 text-primary" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">باسم: {WALLET_NAME}</p>
                          </div>
                          
                          <p className="text-sm text-primary text-center font-medium">
                            بعد التحويل، أرسل صورة الإيصال عبر واتساب
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المجموع الفرعي</span>
                        <span>{getTotalPrice()} ج.م</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>الإجمالي</span>
                        <span className="text-primary">{getTotalPrice()} ج.م</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                          جاري تأكيد الطلب...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="ml-2 h-5 w-5" />
                          تأكيد الطلب
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Order Invoice Modal */}
      <OrderInvoiceModal
        open={showInvoice}
        onClose={handleInvoiceClose}
        order={completedOrder}
        items={orderItems}
        onWhatsAppSend={handleWhatsAppFromInvoice}
      />
    </div>
  );
};

export default Cart;
