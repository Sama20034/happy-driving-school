import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Clock, Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Captain {
  id: string;
  name: string;
  branches: { name: string } | null;
}

interface Availability {
  id?: string;
  captain_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الإثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
];

const CaptainAvailability = () => {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [selectedCaptainId, setSelectedCaptainId] = useState<string>("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCaptains();
  }, []);

  useEffect(() => {
    if (selectedCaptainId) {
      fetchAvailability(selectedCaptainId);
    }
  }, [selectedCaptainId]);

  const fetchCaptains = async () => {
    const { data, error } = await supabase
      .from("captains")
      .select("id, name, branches(name)")
      .order("name");

    if (error) {
      toast.error("خطأ في تحميل الكباتن");
    } else {
      setCaptains(data || []);
      if (data && data.length > 0) {
        setSelectedCaptainId(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchAvailability = async (captainId: string) => {
    const { data, error } = await supabase
      .from("captain_availability")
      .select("*")
      .eq("captain_id", captainId)
      .order("day_of_week");

    if (error) {
      toast.error("خطأ في تحميل المواعيد");
    } else {
      setAvailability(data || []);
    }
  };

  const addNewDay = () => {
    // Find first day not already added
    const usedDays = availability.map((a) => a.day_of_week);
    const availableDay = DAYS_OF_WEEK.find((d) => !usedDays.includes(d.value));
    
    if (!availableDay) {
      toast.error("تم إضافة جميع الأيام");
      return;
    }

    setAvailability([
      ...availability,
      {
        captain_id: selectedCaptainId,
        day_of_week: availableDay.value,
        start_time: "09:00",
        end_time: "17:00",
        slot_duration_minutes: 60,
        is_active: true,
      },
    ]);
  };

  const updateAvailability = (index: number, field: keyof Availability, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeDay = async (index: number) => {
    const item = availability[index];
    
    if (item.id) {
      const { error } = await supabase
        .from("captain_availability")
        .delete()
        .eq("id", item.id);

      if (error) {
        toast.error("خطأ في الحذف");
        return;
      }
    }

    setAvailability(availability.filter((_, i) => i !== index));
    toast.success("تم حذف اليوم");
  };

  const saveAll = async () => {
    setSaving(true);

    try {
      for (const item of availability) {
        const payload = {
          captain_id: item.captain_id,
          day_of_week: item.day_of_week,
          start_time: item.start_time,
          end_time: item.end_time,
          slot_duration_minutes: item.slot_duration_minutes,
          is_active: item.is_active,
        };

        if (item.id) {
          const { error } = await supabase
            .from("captain_availability")
            .update(payload)
            .eq("id", item.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("captain_availability")
            .insert(payload);

          if (error) throw error;
        }
      }

      toast.success("تم حفظ المواعيد بنجاح");
      fetchAvailability(selectedCaptainId);
    } catch (error: any) {
      console.error(error);
      toast.error("خطأ في الحفظ: " + (error.message || "حدث خطأ"));
    } finally {
      setSaving(false);
    }
  };

  const getDayLabel = (dayValue: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayValue)?.label || "";
  };

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <>
      <Helmet>
        <title>إدارة المواعيد | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة مواعيد الكباتن</h1>
          <p className="text-muted-foreground">تحديد الأوقات المتاحة لكل كابتن</p>
        </div>

        {/* Captain Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              اختر الكابتن
            </CardTitle>
            <CardDescription>حدد الكابتن لإدارة مواعيده</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCaptainId} onValueChange={setSelectedCaptainId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="اختر الكابتن" />
              </SelectTrigger>
              <SelectContent>
                {captains.map((captain) => (
                  <SelectItem key={captain.id} value={captain.id}>
                    {captain.name} - {captain.branches?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Availability Schedule */}
        {selectedCaptainId && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>جدول المواعيد</CardTitle>
                <CardDescription>
                  حدد أيام وساعات العمل ومدة كل حجز
                </CardDescription>
              </div>
              <Button onClick={addNewDay} variant="outline">
                <Plus className="ml-2 h-4 w-4" />
                إضافة يوم
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {availability.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد مواعيد محددة. اضغط "إضافة يوم" لبدء الإعداد.
                </div>
              ) : (
                availability.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border"
                  >
                    {/* Day Selection */}
                    <div className="w-32">
                      <Label className="text-xs text-muted-foreground mb-1 block">اليوم</Label>
                      <Select
                        value={item.day_of_week.toString()}
                        onValueChange={(val) =>
                          updateAvailability(index, "day_of_week", parseInt(val))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem
                              key={day.value}
                              value={day.value.toString()}
                              disabled={
                                availability.some(
                                  (a, i) => i !== index && a.day_of_week === day.value
                                )
                              }
                            >
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Start Time */}
                    <div className="w-28">
                      <Label className="text-xs text-muted-foreground mb-1 block">من الساعة</Label>
                      <Input
                        type="time"
                        value={item.start_time}
                        onChange={(e) =>
                          updateAvailability(index, "start_time", e.target.value)
                        }
                      />
                    </div>

                    {/* End Time */}
                    <div className="w-28">
                      <Label className="text-xs text-muted-foreground mb-1 block">إلى الساعة</Label>
                      <Input
                        type="time"
                        value={item.end_time}
                        onChange={(e) =>
                          updateAvailability(index, "end_time", e.target.value)
                        }
                      />
                    </div>

                    {/* Slot Duration */}
                    <div className="w-32">
                      <Label className="text-xs text-muted-foreground mb-1 block">مدة الحجز (دقيقة)</Label>
                      <Input
                        type="number"
                        min={15}
                        max={180}
                        step={15}
                        value={item.slot_duration_minutes}
                        onChange={(e) =>
                          updateAvailability(
                            index,
                            "slot_duration_minutes",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={(checked) =>
                          updateAvailability(index, "is_active", checked)
                        }
                      />
                      <Label className="text-sm">مفعّل</Label>
                    </div>

                    {/* Delete */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive mr-auto"
                      onClick={() => removeDay(index)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))
              )}

              {availability.length > 0 && (
                <Button
                  onClick={saveAll}
                  className="w-full gradient-primary"
                  disabled={saving}
                >
                  <Save className="ml-2 h-4 w-4" />
                  {saving ? "جاري الحفظ..." : "حفظ جميع المواعيد"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CaptainAvailability;
