import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
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

interface Governorate {
  id: string;
  name: string;
  country_id: string | null;
  created_at: string;
  display_order: number;
  countries: { name: string } | null;
}

interface Country {
  id: string;
  name: string;
}

const Governorates = () => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");

  const fetchGovernorates = async () => {
    const { data, error } = await supabase
      .from("governorates")
      .select("*, countries(name)")
      .order("display_order");

    if (error) {
      toast.error("خطأ في تحميل البيانات");
    } else {
      setGovernorates(data || []);
    }
    setLoading(false);
  };

  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from("countries")
      .select("id, name")
      .order("display_order");

    if (!error) {
      setCountries(data || []);
    }
  };

  useEffect(() => {
    fetchGovernorates();
    fetchCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase
        .from("governorates")
        .update({ name, country_id: countryId || null })
        .eq("id", editingId);

      if (error) {
        toast.error("خطأ في التحديث");
      } else {
        toast.success("تم التحديث بنجاح");
      }
    } else {
      const maxOrder = governorates.length > 0 
        ? Math.max(...governorates.map(g => g.display_order)) + 1 
        : 1;

      const { error } = await supabase
        .from("governorates")
        .insert({ name, country_id: countryId || null, display_order: maxOrder });

      if (error) {
        toast.error("خطأ في الإضافة");
      } else {
        toast.success("تمت الإضافة بنجاح");
      }
    }

    setIsOpen(false);
    setName("");
    setCountryId("");
    setEditingId(null);
    fetchGovernorates();
  };

  const handleEdit = (gov: Governorate) => {
    setEditingId(gov.id);
    setName(gov.name);
    setCountryId(gov.country_id || "");
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase
      .from("governorates")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("خطأ في الحذف - قد تكون هناك فروع مرتبطة");
    } else {
      toast.success("تم الحذف بنجاح");
      fetchGovernorates();
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === governorates.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newGovernorates = [...governorates];
    const [movedItem] = newGovernorates.splice(index, 1);
    newGovernorates.splice(newIndex, 0, movedItem);

    const updates = [
      { id: newGovernorates[index].id, display_order: index + 1 },
      { id: newGovernorates[newIndex].id, display_order: newIndex + 1 },
    ];

    setGovernorates(newGovernorates);

    for (const update of updates) {
      await supabase
        .from("governorates")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }
    
    toast.success("تم تحديث الترتيب");
  };

  return (
    <>
      <Helmet>
        <title>إدارة المحافظات | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المحافظات</h1>
            <p className="text-muted-foreground">إضافة وتعديل المحافظات (استخدم الأسهم للترتيب)</p>
          </div>

          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setName("");
              setCountryId("");
              setEditingId(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="ml-2 h-4 w-4" />
                إضافة محافظة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "تعديل المحافظة" : "إضافة محافظة جديدة"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">الدولة</Label>
                  <Select value={countryId} onValueChange={setCountryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المحافظة</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسم المحافظة"
                    required
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
                  <TableHead className="text-right">المحافظة</TableHead>
                  <TableHead className="text-right">الدولة</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {governorates.map((gov, index) => (
                  <TableRow key={gov.id}>
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
                          disabled={index === governorates.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{gov.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{gov.countries?.name || "-"}</TableCell>
                    <TableCell>
                      {new Date(gov.created_at).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(gov)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(gov.id)}
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

export default Governorates;