import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GraduationCap, Save, Calculator, Percent } from "lucide-react";

interface CaptainCoursePricingProps {
  captainId: string;
}

interface CoursePrice {
  id?: string;
  course_type: "practice" | "beginner" | "professional";
  session_price: number;
}

const COURSE_CONFIG = {
  practice: {
    name: "كورس الممارسة",
    sessions: 6,
    description: "للمتدربين الذين يمتلكون أساسيات القيادة ويريدون التمرين"
  },
  beginner: {
    name: "كورس المبتدئين",
    sessions: 8,
    description: "للمتدربين الجدد الذين يبدأون من الصفر"
  },
  professional: {
    name: "كورس الاحتراف",
    sessions: 10,
    description: "كورس شامل للوصول لمستوى احترافي"
  }
};

const DISCOUNT_PERCENTAGE = 0.05; // 5% خصم

export const CaptainCoursePricing = ({ captainId }: CaptainCoursePricingProps) => {
  const [prices, setPrices] = useState<CoursePrice[]>([
    { course_type: "practice", session_price: 0 },
    { course_type: "beginner", session_price: 0 },
    { course_type: "professional", session_price: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, [captainId]);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from("captain_course_prices")
        .select("*")
        .eq("captain_id", captainId);

      if (error) throw error;

      if (data && data.length > 0) {
        setPrices(prev => prev.map(p => {
          const existing = data.find(d => d.course_type === p.course_type);
          return existing ? { ...existing, course_type: existing.course_type as CoursePrice["course_type"] } : p;
        }));
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (courseType: string, value: number) => {
    setPrices(prev => prev.map(p => 
      p.course_type === courseType ? { ...p, session_price: value } : p
    ));
  };

  const calculateTotalWithDiscount = (sessionPrice: number, sessions: number) => {
    const total = sessionPrice * sessions;
    const discountedTotal = total * (1 - DISCOUNT_PERCENTAGE);
    return Math.round(discountedTotal);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const price of prices) {
        if (price.session_price <= 0) continue;

        const { data: existing } = await supabase
          .from("captain_course_prices")
          .select("id")
          .eq("captain_id", captainId)
          .eq("course_type", price.course_type)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("captain_course_prices")
            .update({ session_price: price.session_price })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("captain_course_prices")
            .insert({
              captain_id: captainId,
              course_type: price.course_type,
              session_price: price.session_price
            });
          if (error) throw error;
        }
      }

      toast.success("تم حفظ أسعار الكورسات بنجاح");
      fetchPrices();
    } catch (error) {
      console.error("Error saving prices:", error);
      toast.error("حدث خطأ أثناء حفظ الأسعار");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          تسعير الكورسات
        </CardTitle>
        <CardDescription>
          حدد سعر الحصة لكل كورس. سيتم خصم 5% من سعر الحصة عند حساب إجمالي الكورس
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <Percent className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary">خصم 5% على الكورسات</p>
            <p className="text-muted-foreground mt-1">
              عند حجز كورس كامل، يحصل المتدرب على خصم 5% من إجمالي سعر الكورس
            </p>
          </div>
        </div>

        {/* Course Pricing Cards */}
        <div className="grid gap-4">
          {prices.map((price) => {
            const config = COURSE_CONFIG[price.course_type];
            const totalWithDiscount = calculateTotalWithDiscount(price.session_price, config.sessions);
            const totalWithoutDiscount = price.session_price * config.sessions;
            const savings = totalWithoutDiscount - totalWithDiscount;

            return (
              <div 
                key={price.course_type} 
                className="border rounded-lg p-4 space-y-4 bg-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{config.name}</h3>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      {config.sessions} حصص
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`price-${price.course_type}`}>سعر الحصة (جنيه)</Label>
                    <Input
                      id={`price-${price.course_type}`}
                      type="number"
                      min="0"
                      value={price.session_price || ""}
                      onChange={(e) => handlePriceChange(price.course_type, Number(e.target.value))}
                      placeholder="أدخل سعر الحصة"
                    />
                  </div>

                  {price.session_price > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">حساب الكورس:</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">قبل الخصم:</span>
                          <span className="line-through text-muted-foreground">
                            {totalWithoutDiscount} جنيه
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-primary">
                          <span>بعد الخصم (5%):</span>
                          <span>{totalWithDiscount} جنيه</span>
                        </div>
                        <div className="flex justify-between text-green-600 text-xs">
                          <span>التوفير:</span>
                          <span>{savings} جنيه</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ الأسعار"}
        </Button>
      </CardContent>
    </Card>
  );
};
