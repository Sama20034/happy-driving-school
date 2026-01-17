import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2, Globe, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Country {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
  display_order: number;
}

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "" });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("display_order");

    if (!error) {
      setCountries(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCountry) {
      const { error } = await supabase
        .from("countries")
        .update({ name: formData.name, code: formData.code || null })
        .eq("id", editingCountry.id);

      if (error) {
        toast.error("حدث خطأ أثناء التحديث");
      } else {
        toast.success("تم تحديث الدولة بنجاح");
        fetchCountries();
      }
    } else {
      // Get max display_order
      const maxOrder = countries.length > 0 
        ? Math.max(...countries.map(c => c.display_order)) + 1 
        : 1;
      
      const { error } = await supabase
        .from("countries")
        .insert({ name: formData.name, code: formData.code || null, display_order: maxOrder });

      if (error) {
        toast.error("حدث خطأ أثناء الإضافة");
      } else {
        toast.success("تم إضافة الدولة بنجاح");
        fetchCountries();
      }
    }

    setIsOpen(false);
    setEditingCountry(null);
    setFormData({ name: "", code: "" });
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData({ name: country.name, code: country.code || "" });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدولة؟")) return;

    const { error } = await supabase.from("countries").delete().eq("id", id);

    if (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } else {
      toast.success("تم حذف الدولة بنجاح");
      fetchCountries();
    }
  };

  const openAddDialog = () => {
    setEditingCountry(null);
    setFormData({ name: "", code: "" });
    setIsOpen(true);
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === countries.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newCountries = [...countries];
    const [movedItem] = newCountries.splice(index, 1);
    newCountries.splice(newIndex, 0, movedItem);

    // Update display_order for both items
    const updates = [
      { id: newCountries[index].id, display_order: index + 1 },
      { id: newCountries[newIndex].id, display_order: newIndex + 1 },
    ];

    setCountries(newCountries);

    for (const update of updates) {
      await supabase
        .from("countries")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }
    
    toast.success("تم تحديث الترتيب");
  };

  return (
    <>
      <Helmet>
        <title>إدارة الدول | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة الدول</h1>
            <p className="text-muted-foreground">إضافة وتعديل وحذف الدول (اسحب للترتيب)</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="gradient-primary text-primary-foreground gap-2">
                <Plus size={18} />
                إضافة دولة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCountry ? "تعديل الدولة" : "إضافة دولة جديدة"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الدولة</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مصر"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">كود الدولة (اختياري)</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="EG"
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                  {editingCountry ? "تحديث" : "إضافة"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">الترتيب</TableHead>
                <TableHead>الدولة</TableHead>
                <TableHead>الكود</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : countries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد دول حتى الآن
                  </TableCell>
                </TableRow>
              ) : (
                countries.map((country, index) => (
                  <TableRow key={country.id}>
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
                          disabled={index === countries.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{country.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{country.code || "-"}</TableCell>
                    <TableCell>
                      {new Date(country.created_at).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(country)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(country.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Countries;