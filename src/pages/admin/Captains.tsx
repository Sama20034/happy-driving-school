import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2, Star, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploadImage";
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

interface Captain {
  id: string;
  name: string;
  image_url: string | null;
  rating: number | null;
  branch_id: string;
  branches: { 
    name: string; 
    governorates: { 
      name: string;
      countries: { name: string } | null;
    } | null 
  } | null;
  created_at: string;
}

interface Country {
  id: string;
  name: string;
}

interface Governorate {
  id: string;
  name: string;
  country_id: string | null;
}

interface Branch {
  id: string;
  name: string;
  governorate_id: string;
  governorates: { name: string; country_id: string | null } | null;
}

const Captains = () => {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredGovernorates, setFilteredGovernorates] = useState<Governorate[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    rating: 5,
    country_id: "",
    governorate_id: "",
    branch_id: "",
  });

  const fetchData = async () => {
    const [captainsRes, countriesRes, governoratesRes, branchesRes] = await Promise.all([
      supabase
        .from("captains")
        .select("*, branches(name, governorates(name, countries(name)))")
        .order("name"),
      supabase
        .from("countries")
        .select("id, name")
        .order("name"),
      supabase
        .from("governorates")
        .select("id, name, country_id")
        .order("name"),
      supabase
        .from("branches")
        .select("id, name, governorate_id, governorates(name, country_id)")
        .order("name"),
    ]);

    if (captainsRes.error) toast.error("خطأ في تحميل الكباتن");
    else setCaptains(captainsRes.data || []);

    if (countriesRes.error) toast.error("خطأ في تحميل الدول");
    else setCountries(countriesRes.data || []);

    if (governoratesRes.error) toast.error("خطأ في تحميل المحافظات");
    else setGovernorates(governoratesRes.data || []);

    if (branchesRes.error) toast.error("خطأ في تحميل الفروع");
    else setBranches(branchesRes.data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter governorates when country changes
  useEffect(() => {
    if (formData.country_id) {
      const filtered = governorates.filter(g => g.country_id === formData.country_id);
      setFilteredGovernorates(filtered);
    } else {
      setFilteredGovernorates([]);
    }
    // Reset governorate and branch when country changes
    if (!editingId) {
      setFormData(prev => ({ ...prev, governorate_id: "", branch_id: "" }));
      setFilteredBranches([]);
    }
  }, [formData.country_id, governorates]);

  // Filter branches when governorate changes
  useEffect(() => {
    if (formData.governorate_id) {
      const filtered = branches.filter(b => b.governorate_id === formData.governorate_id);
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches([]);
    }
    // Reset branch when governorate changes
    if (!editingId) {
      setFormData(prev => ({ ...prev, branch_id: "" }));
    }
  }, [formData.governorate_id, branches]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة صالحة");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploading(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData({ ...formData, image_url: result.url });
        setImagePreview(result.url);
        toast.success("تم رفع الصورة بنجاح");
      } else {
        throw new Error(result.error || "فشل في رفع الصورة");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "خطأ في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      image_url: formData.image_url || null,
      rating: formData.rating,
      branch_id: formData.branch_id,
    };

    if (editingId) {
      const { error } = await supabase
        .from("captains")
        .update(payload)
        .eq("id", editingId);

      if (error) toast.error("خطأ في التحديث");
      else toast.success("تم التحديث بنجاح");
    } else {
      const { error } = await supabase.from("captains").insert(payload);

      if (error) toast.error("خطأ في الإضافة");
      else toast.success("تمت الإضافة بنجاح");
    }

    setIsOpen(false);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setFormData({ name: "", image_url: "", rating: 5, country_id: "", governorate_id: "", branch_id: "" });
    setEditingId(null);
    setImagePreview(null);
    setFilteredGovernorates([]);
    setFilteredBranches([]);
  };

  const handleEdit = (captain: Captain) => {
    // Find the branch to get governorate and country
    const branch = branches.find(b => b.id === captain.branch_id);
    const governorate = governorates.find(g => g.id === branch?.governorate_id);
    
    setEditingId(captain.id);
    setFormData({
      name: captain.name,
      image_url: captain.image_url || "",
      rating: captain.rating || 5,
      country_id: governorate?.country_id || "",
      governorate_id: branch?.governorate_id || "",
      branch_id: captain.branch_id,
    });
    setImagePreview(captain.image_url);
    
    // Set filtered lists for editing
    if (governorate?.country_id) {
      setFilteredGovernorates(governorates.filter(g => g.country_id === governorate.country_id));
    }
    if (branch?.governorate_id) {
      setFilteredBranches(branches.filter(b => b.governorate_id === branch.governorate_id));
    }
    
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("captains").delete().eq("id", id);

    if (error) toast.error("خطأ في الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchData();
    }
  };

  return (
    <>
      <Helmet>
        <title>إدارة الكباتن | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الكباتن</h1>
            <p className="text-muted-foreground">إضافة وتعديل الكباتن</p>
          </div>

          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="ml-2 h-4 w-4" />
                إضافة كابتن
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "تعديل الكابتن" : "إضافة كابتن جديد"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Country Selection */}
                <div className="space-y-2">
                  <Label>الدولة</Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(val) =>
                      setFormData({ ...formData, country_id: val, governorate_id: "", branch_id: "" })
                    }
                  >
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

                {/* Governorate Selection */}
                <div className="space-y-2">
                  <Label>المحافظة</Label>
                  <Select
                    value={formData.governorate_id}
                    onValueChange={(val) =>
                      setFormData({ ...formData, governorate_id: val, branch_id: "" })
                    }
                    disabled={!formData.country_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.country_id ? "اختر المحافظة" : "اختر الدولة أولاً"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredGovernorates.map((gov) => (
                        <SelectItem key={gov.id} value={gov.id}>
                          {gov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Selection */}
                <div className="space-y-2">
                  <Label>الفرع</Label>
                  <Select
                    value={formData.branch_id}
                    onValueChange={(val) =>
                      setFormData({ ...formData, branch_id: val })
                    }
                    disabled={!formData.governorate_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.governorate_id ? "اختر الفرع" : "اختر المحافظة أولاً"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">اسم الكابتن</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="أدخل اسم الكابتن"
                    required
                  />
                </div>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>صورة الكابتن</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الرفع...
                        </>
                      ) : (
                        <>
                          <Upload className="ml-2 h-4 w-4" />
                          {imagePreview ? "تغيير الصورة" : "رفع صورة"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">التقييم (من 5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary" disabled={uploading || !formData.branch_id}>
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
                  <TableHead className="text-right">الصورة</TableHead>
                  <TableHead className="text-right">اسم الكابتن</TableHead>
                  <TableHead className="text-right">الدولة</TableHead>
                  <TableHead className="text-right">الفرع</TableHead>
                  <TableHead className="text-right">التقييم</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captains.map((captain) => (
                  <TableRow key={captain.id}>
                    <TableCell>
                      <img
                        src={captain.image_url || "https://i.pravatar.cc/40"}
                        alt={captain.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{captain.name}</TableCell>
                    <TableCell>
                      {captain.branches?.governorates?.countries?.name || "-"}
                    </TableCell>
                    <TableCell>
                      {captain.branches?.name} - {captain.branches?.governorates?.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        {captain.rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(captain)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(captain.id)}
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

export default Captains;
