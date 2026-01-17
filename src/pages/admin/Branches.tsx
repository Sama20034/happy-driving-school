import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Branch {
  id: string;
  name: string;
  address: string | null;
  governorate_id: string;
  display_order: number;
  governorates: { name: string } | null;
  created_at: string;
}

interface Governorate {
  id: string;
  name: string;
}

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    governorate_id: "",
  });

  const fetchData = async () => {
    const [branchesRes, governoratesRes] = await Promise.all([
      supabase
        .from("branches")
        .select("*, governorates(name)")
        .order("display_order"),
      supabase.from("governorates").select("id, name").order("display_order"),
    ]);

    if (branchesRes.error) toast.error("خطأ في تحميل الفروع");
    else setBranches(branchesRes.data || []);

    if (governoratesRes.error) toast.error("خطأ في تحميل المحافظات");
    else setGovernorates(governoratesRes.data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      address: formData.address || null,
      governorate_id: formData.governorate_id,
    };

    if (editingId) {
      const { error } = await supabase
        .from("branches")
        .update(payload)
        .eq("id", editingId);

      if (error) toast.error("خطأ في التحديث");
      else toast.success("تم التحديث بنجاح");
    } else {
      const maxOrder = branches.length > 0 
        ? Math.max(...branches.map(b => b.display_order)) + 1 
        : 1;

      const { error } = await supabase.from("branches").insert({ ...payload, display_order: maxOrder });

      if (error) toast.error("خطأ في الإضافة");
      else toast.success("تمت الإضافة بنجاح");
    }

    setIsOpen(false);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", governorate_id: "" });
    setEditingId(null);
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setFormData({
      name: branch.name,
      address: branch.address || "",
      governorate_id: branch.governorate_id,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("branches").delete().eq("id", id);

    if (error) toast.error("خطأ في الحذف - قد يكون هناك كباتن مرتبطين");
    else {
      toast.success("تم الحذف بنجاح");
      fetchData();
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === branches.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newBranches = [...branches];
    const [movedItem] = newBranches.splice(index, 1);
    newBranches.splice(newIndex, 0, movedItem);

    const updates = [
      { id: newBranches[index].id, display_order: index + 1 },
      { id: newBranches[newIndex].id, display_order: newIndex + 1 },
    ];

    setBranches(newBranches);

    for (const update of updates) {
      await supabase
        .from("branches")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }
    
    toast.success("تم تحديث الترتيب");
  };

  return (
    <>
      <Helmet>
        <title>إدارة الفروع | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الفروع</h1>
            <p className="text-muted-foreground">إضافة وتعديل الفروع (استخدم الأسهم للترتيب)</p>
          </div>

          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="ml-2 h-4 w-4" />
                إضافة فرع
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "تعديل الفرع" : "إضافة فرع جديد"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>المحافظة</Label>
                  <Select
                    value={formData.governorate_id}
                    onValueChange={(val) =>
                      setFormData({ ...formData, governorate_id: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov.id} value={gov.id}>
                          {gov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الفرع</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="أدخل اسم الفرع"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="أدخل العنوان"
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary">
                  {editingId ? "تحديث" : "إضافة"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-right">الترتيب</TableHead>
                  <TableHead className="text-right">اسم الفرع</TableHead>
                  <TableHead className="text-right">المحافظة</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch, index) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                        >
                          ▲
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === branches.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{branch.governorates?.name}</TableCell>
                    <TableCell>{branch.address || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(branch)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(branch.id)}
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

export default Branches;