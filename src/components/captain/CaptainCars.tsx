import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Car, Plus, Trash2, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CaptainCar {
  id: string;
  captain_id: string;
  car_type: string;
  transmission_type: string;
  car_photo_url: string | null;
  is_primary: boolean;
  created_at: string;
}

interface CaptainCarsProps {
  captainId: string;
}

export const CaptainCars = ({ captainId }: CaptainCarsProps) => {
  const [cars, setCars] = useState<CaptainCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCar] = useState({ car_type: "", transmission_type: "" });

  useEffect(() => {
    fetchCars();
  }, [captainId]);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("captain_cars")
      .select("*")
      .eq("captain_id", captainId)
      .order("created_at");

    if (error) {
      console.error("Error fetching cars:", error);
    } else {
      setCars(data || []);
    }
    setLoading(false);
  };

  const handleAddCar = async () => {
    if (!newCar.car_type.trim() || !newCar.transmission_type) {
      toast.error("يرجى ملء جميع البيانات");
      return;
    }

    setAdding(true);
    const { error } = await supabase.from("captain_cars").insert({
      captain_id: captainId,
      car_type: newCar.car_type.trim(),
      transmission_type: newCar.transmission_type,
      is_primary: cars.length === 0,
    });

    if (error) {
      console.error("Error adding car:", error);
      toast.error("حدث خطأ أثناء إضافة السيارة");
    } else {
      toast.success("تم إضافة السيارة بنجاح");
      setNewCar({ car_type: "", transmission_type: "" });
      setShowForm(false);
      fetchCars();
    }
    setAdding(false);
  };

  const handleDeleteCar = async (carId: string) => {
    const { error } = await supabase.from("captain_cars").delete().eq("id", carId);
    if (error) {
      toast.error("حدث خطأ أثناء حذف السيارة");
    } else {
      toast.success("تم حذف السيارة");
      fetchCars();
    }
  };

  const handleSetPrimary = async (carId: string) => {
    // Remove primary from all
    await supabase
      .from("captain_cars")
      .update({ is_primary: false })
      .eq("captain_id", captainId);

    // Set new primary
    await supabase
      .from("captain_cars")
      .update({ is_primary: true })
      .eq("id", carId);

    toast.success("تم تعيين السيارة الأساسية");
    fetchCars();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            سياراتي
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة سيارة
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Car Form */}
        {showForm && (
          <div className="p-4 border border-dashed border-primary/50 rounded-xl bg-primary/5 space-y-4">
            <h4 className="font-semibold text-sm">إضافة سيارة جديدة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع السيارة *</Label>
                <Input
                  value={newCar.car_type}
                  onChange={(e) => setNewCar({ ...newCar, car_type: e.target.value })}
                  placeholder="مثال: تويوتا كورولا 2023"
                />
              </div>
              <div className="space-y-2">
                <Label>نوع ناقل الحركة *</Label>
                <Select
                  value={newCar.transmission_type}
                  onValueChange={(value) => setNewCar({ ...newCar, transmission_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">مانيوال</SelectItem>
                    <SelectItem value="automatic">أوتوماتيك</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCar} disabled={adding} size="sm">
                {adding ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                إضافة
              </Button>
              <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Cars List */}
        {cars.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد سيارات مسجلة</p>
            <p className="text-sm">اضغط "إضافة سيارة" لإضافة سيارتك الأولى</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  car.is_primary ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    car.is_primary ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}>
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{car.car_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {car.transmission_type === "manual" ? "مانيوال" : "أوتوماتيك"}
                    </p>
                  </div>
                  {car.is_primary && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" />
                      أساسية
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!car.is_primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(car.id)}
                      className="text-xs"
                    >
                      تعيين كأساسية
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCar(car.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
