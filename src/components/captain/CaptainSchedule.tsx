import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";

interface Schedule {
  id: string;
  captain_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const DAYS = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الإثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
];

interface CaptainScheduleProps {
  captainId: string;
}

export const CaptainSchedule = ({ captainId }: CaptainScheduleProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [captainId]);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("captain_schedule")
        .select("*")
        .eq("captain_id", captainId)
        .order("day_of_week")
        .order("start_time");

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (dayOfWeek: number) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("captain_schedule")
        .insert({
          captain_id: captainId,
          day_of_week: dayOfWeek,
          start_time: "09:00",
          end_time: "17:00",
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setSchedules([...schedules, data]);
      toast.success("تمت إضافة الموعد");
    } catch (error: any) {
      console.error("Error adding schedule:", error);
      toast.error("حدث خطأ أثناء إضافة الموعد");
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    try {
      const { error } = await supabase
        .from("captain_schedule")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setSchedules(schedules.map((s) => (s.id === id ? { ...s, ...updates } : s)));
      toast.success("تم تحديث الموعد");
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("حدث خطأ أثناء تحديث الموعد");
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from("captain_schedule")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSchedules(schedules.filter((s) => s.id !== id));
      toast.success("تم حذف الموعد");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("حدث خطأ أثناء حذف الموعد");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          جدول المواعيد المتاحة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {DAYS.map((day) => {
            const daySchedules = schedules.filter((s) => s.day_of_week === day.value);
            
            return (
              <div key={day.value} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{day.label}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSchedule(day.value)}
                    disabled={saving}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة فترة
                  </Button>
                </div>

                {daySchedules.length === 0 ? (
                  <p className="text-muted-foreground text-sm">لا توجد فترات محددة</p>
                ) : (
                  <div className="space-y-3">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-muted/50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">من:</Label>
                            <Input
                              type="time"
                              value={schedule.start_time}
                              onChange={(e) =>
                                updateSchedule(schedule.id, { start_time: e.target.value })
                              }
                              className="w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">إلى:</Label>
                            <Input
                              type="time"
                              value={schedule.end_time}
                              onChange={(e) =>
                                updateSchedule(schedule.id, { end_time: e.target.value })
                              }
                              className="w-32"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={schedule.is_active}
                              onCheckedChange={(checked) =>
                                updateSchedule(schedule.id, { is_active: checked })
                              }
                            />
                            <Label className="text-sm">
                              {schedule.is_active ? "مفعل" : "معطل"}
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSchedule(schedule.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
