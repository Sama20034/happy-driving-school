import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
  id: string;
  title: string;
  sessions: number;
  price: number;
  description: string | null;
  created_at: string;
}

interface Governorate {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
  governorate_id: string;
}

interface CoursePrice {
  id: string;
  course_id: string;
  governorate_id: string | null;
  branch_id: string | null;
  price: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [coursePrices, setCoursePrices] = useState<CoursePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    sessions: 1,
    price: 0,
    description: "",
  });

  const [priceFormData, setPriceFormData] = useState({
    governorate_id: "",
    branch_id: "",
    price: 0,
    sameForAllBranches: true,
  });

  const fetchData = async () => {
    const [coursesRes, governoratesRes, branchesRes, pricesRes] = await Promise.all([
      supabase.from("courses").select("*").order("price"),
      supabase.from("governorates").select("*").order("name"),
      supabase.from("branches").select("*").order("name"),
      supabase.from("course_prices").select("*"),
    ]);

    if (coursesRes.error) toast.error("خطأ في تحميل البيانات");
    else setCourses(coursesRes.data || []);

    if (!governoratesRes.error) setGovernorates(governoratesRes.data || []);
    if (!branchesRes.error) setBranches(branchesRes.data || []);
    if (!pricesRes.error) setCoursePrices(pricesRes.data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      sessions: formData.sessions,
      price: formData.price,
      description: formData.description || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("courses")
        .update(payload)
        .eq("id", editingId);

      if (error) toast.error("خطأ في التحديث");
      else toast.success("تم التحديث بنجاح");
    } else {
      const { error } = await supabase.from("courses").insert(payload);

      if (error) toast.error("خطأ في الإضافة");
      else toast.success("تمت الإضافة بنجاح");
    }

    setIsOpen(false);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setFormData({ title: "", sessions: 1, price: 0, description: "" });
    setEditingId(null);
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      sessions: course.sessions,
      price: course.price,
      description: course.description || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) toast.error("خطأ في الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchData();
    }
  };

  const openPriceDialog = (course: Course) => {
    setSelectedCourse(course);
    setPriceFormData({
      governorate_id: "",
      branch_id: "",
      price: course.price,
      sameForAllBranches: true,
    });
    setIsPriceDialogOpen(true);
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const payload = {
      course_id: selectedCourse.id,
      governorate_id: priceFormData.governorate_id || null,
      branch_id: priceFormData.sameForAllBranches ? null : (priceFormData.branch_id || null),
      price: priceFormData.price,
    };

    // Check if price already exists
    const existingPrice = coursePrices.find(
      (p) =>
        p.course_id === payload.course_id &&
        p.governorate_id === payload.governorate_id &&
        p.branch_id === payload.branch_id
    );

    if (existingPrice) {
      const { error } = await supabase
        .from("course_prices")
        .update({ price: payload.price })
        .eq("id", existingPrice.id);

      if (error) toast.error("خطأ في التحديث");
      else toast.success("تم تحديث السعر بنجاح");
    } else {
      const { error } = await supabase.from("course_prices").insert(payload);

      if (error) toast.error("خطأ في الإضافة");
      else toast.success("تمت إضافة السعر بنجاح");
    }

    fetchData();
    setPriceFormData({
      governorate_id: "",
      branch_id: "",
      price: selectedCourse.price,
      sameForAllBranches: true,
    });
  };

  const handleDeletePrice = async (priceId: string) => {
    const { error } = await supabase.from("course_prices").delete().eq("id", priceId);

    if (error) toast.error("خطأ في الحذف");
    else {
      toast.success("تم حذف السعر");
      fetchData();
    }
  };

  const getCoursePrices = (courseId: string) => {
    return coursePrices.filter((p) => p.course_id === courseId);
  };

  const getGovernorateName = (id: string | null) => {
    if (!id) return "الكل";
    return governorates.find((g) => g.id === id)?.name || "-";
  };

  const getBranchName = (id: string | null) => {
    if (!id) return "كل الفروع";
    return branches.find((b) => b.id === id)?.name || "-";
  };

  const filteredBranches = branches.filter(
    (b) => b.governorate_id === priceFormData.governorate_id
  );

  return (
    <>
      <Helmet>
        <title>إدارة الكورسات | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الكورسات</h1>
            <p className="text-muted-foreground">إضافة وتعديل الكورسات والأسعار</p>
          </div>

          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="ml-2 h-4 w-4" />
                إضافة كورس
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "تعديل الكورس" : "إضافة كورس جديد"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">اسم الكورس</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="أدخل اسم الكورس"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessions">عدد الحصص</Label>
                    <Input
                      id="sessions"
                      type="number"
                      min={1}
                      value={formData.sessions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sessions: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر الافتراضي (جنيه)</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="أدخل وصف الكورس"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary">
                  {editingId ? "تحديث" : "إضافة"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Price Dialog */}
        <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                أسعار الكورس: {selectedCourse?.title}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="add" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">إضافة سعر</TabsTrigger>
                <TabsTrigger value="list">الأسعار الحالية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="add" className="space-y-4 mt-4">
                <form onSubmit={handleAddPrice} className="space-y-4">
                  <div className="space-y-2">
                    <Label>المحافظة</Label>
                    <Select
                      value={priceFormData.governorate_id}
                      onValueChange={(val) =>
                        setPriceFormData({ ...priceFormData, governorate_id: val, branch_id: "" })
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

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <Label htmlFor="samePrice" className="cursor-pointer">
                      نفس السعر لكل فروع المحافظة
                    </Label>
                    <Switch
                      id="samePrice"
                      checked={priceFormData.sameForAllBranches}
                      onCheckedChange={(checked) =>
                        setPriceFormData({ ...priceFormData, sameForAllBranches: checked, branch_id: "" })
                      }
                    />
                  </div>

                  {!priceFormData.sameForAllBranches && priceFormData.governorate_id && (
                    <div className="space-y-2">
                      <Label>الفرع</Label>
                      <Select
                        value={priceFormData.branch_id}
                        onValueChange={(val) =>
                          setPriceFormData({ ...priceFormData, branch_id: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفرع" />
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
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="customPrice">السعر (جنيه)</Label>
                    <Input
                      id="customPrice"
                      type="number"
                      min={0}
                      value={priceFormData.price}
                      onChange={(e) =>
                        setPriceFormData({ ...priceFormData, price: parseFloat(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary">
                    حفظ السعر
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="list" className="mt-4">
                {selectedCourse && getCoursePrices(selectedCourse.id).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    لا توجد أسعار مخصصة. يتم استخدام السعر الافتراضي: {selectedCourse.price} جنيه
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المحافظة</TableHead>
                        <TableHead className="text-right">الفرع</TableHead>
                        <TableHead className="text-right">السعر</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCourse && getCoursePrices(selectedCourse.id).map((price) => (
                        <TableRow key={price.id}>
                          <TableCell>{getGovernorateName(price.governorate_id)}</TableCell>
                          <TableCell>{getBranchName(price.branch_id)}</TableCell>
                          <TableCell>{price.price} جنيه</TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDeletePrice(price.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">جاري التحميل...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم الكورس</TableHead>
                  <TableHead className="text-right">عدد الحصص</TableHead>
                  <TableHead className="text-right">السعر الافتراضي</TableHead>
                  <TableHead className="text-right">أسعار مخصصة</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.sessions} حصة</TableCell>
                    <TableCell>{course.price} جنيه</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPriceDialog(course)}
                      >
                        <DollarSign className="ml-1 h-4 w-4" />
                        {getCoursePrices(course.id).length} أسعار
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {course.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(course)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(course.id)}
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

export default Courses;