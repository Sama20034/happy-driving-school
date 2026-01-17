import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Percent, DollarSign, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface DiscountCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  is_active: boolean;
  is_pwa_code: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
}

const DiscountCodes = () => {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    is_active: true,
    is_pwa_code: false,
    max_uses: "",
    expires_at: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCodes(data as DiscountCode[]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      is_active: true,
      is_pwa_code: false,
      max_uses: "",
      expires_at: "",
    });
    setEditingCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discount_value) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // If setting as PWA code, unset any existing PWA code first
    if (formData.is_pwa_code) {
      await supabase
        .from("discount_codes")
        .update({ is_pwa_code: false })
        .eq("is_pwa_code", true);
    }

    const codeData = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      is_active: formData.is_active,
      is_pwa_code: formData.is_pwa_code,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      expires_at: formData.expires_at || null,
    };

    let error;
    if (editingCode) {
      const result = await supabase
        .from("discount_codes")
        .update(codeData)
        .eq("id", editingCode.id);
      error = result.error;
    } else {
      const result = await supabase.from("discount_codes").insert([codeData]);
      error = result.error;
    }

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم بنجاح",
        description: editingCode ? "تم تحديث كود الخصم" : "تم إضافة كود الخصم",
      });
      setIsDialogOpen(false);
      resetForm();
      fetchCodes();
    }
  };

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: code.discount_value.toString(),
      is_active: code.is_active,
      is_pwa_code: code.is_pwa_code,
      max_uses: code.max_uses?.toString() || "",
      expires_at: code.expires_at ? code.expires_at.split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكود؟")) return;

    const { error } = await supabase.from("discount_codes").delete().eq("id", id);

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحذف",
        description: "تم حذف كود الخصم بنجاح",
      });
      fetchCodes();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">أكواد الخصم</h1>
          <p className="text-muted-foreground">إدارة أكواد الخصم والعروض</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} />
              إضافة كود خصم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingCode ? "تعديل كود الخصم" : "إضافة كود خصم جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">كود الخصم *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="مثال: WELCOME10"
                  className="text-left uppercase"
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="discount_type">نوع الخصم *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت (جنيه)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount_value">
                  قيمة الخصم *{" "}
                  {formData.discount_type === "percentage" ? "(%)" : "(جنيه)"}
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                  placeholder={formData.discount_type === "percentage" ? "10" : "50"}
                  min="0"
                  max={formData.discount_type === "percentage" ? "100" : undefined}
                />
              </div>

              <div>
                <Label htmlFor="max_uses">الحد الأقصى للاستخدام (اختياري)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) =>
                    setFormData({ ...formData, max_uses: e.target.value })
                  }
                  placeholder="بدون حد"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="expires_at">تاريخ الانتهاء (اختياري)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) =>
                    setFormData({ ...formData, expires_at: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">كود نشط</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                <div>
                  <Label htmlFor="is_pwa_code" className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-primary" />
                    كود تحميل التطبيق
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    سيظهر هذا الكود للمستخدمين عند تحميل التطبيق
                  </p>
                </div>
                <Switch
                  id="is_pwa_code"
                  checked={formData.is_pwa_code}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_pwa_code: checked })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {editingCode ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {codes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد أكواد خصم حالياً</p>
          </div>
        ) : (
          codes.map((code) => (
            <div
              key={code.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    code.discount_type === "percentage"
                      ? "bg-primary/10 text-primary"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {code.discount_type === "percentage" ? (
                    <Percent size={24} />
                  ) : (
                    <DollarSign size={24} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg font-mono">{code.code}</span>
                    {code.is_pwa_code && (
                      <Badge variant="secondary" className="gap-1">
                        <Gift className="h-3 w-3" />
                        كود التطبيق
                      </Badge>
                    )}
                    {!code.is_active && (
                      <Badge variant="destructive">غير نشط</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {code.discount_type === "percentage"
                      ? `خصم ${code.discount_value}%`
                      : `خصم ${code.discount_value} جنيه`}
                    {code.max_uses && ` • ${code.used_count}/${code.max_uses} استخدام`}
                    {code.expires_at &&
                      ` • ينتهي ${new Date(code.expires_at).toLocaleDateString("ar-EG")}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(code)}
                >
                  <Edit2 size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(code.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscountCodes;
