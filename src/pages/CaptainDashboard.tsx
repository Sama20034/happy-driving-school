import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Calendar, MessageSquare, Bell, Car, Clock, MapPin, Star, Wallet, FileText, GraduationCap, Home } from "lucide-react";
import { CaptainSchedule } from "@/components/captain/CaptainSchedule";
import { CaptainBookings } from "@/components/captain/CaptainBookings";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { ChatList } from "@/components/chat/ChatList";
import { AdminSupportButton } from "@/components/chat/AdminSupportButton";
import { CaptainWallet } from "@/components/captain/CaptainWallet";
import { CaptainCoursePricing } from "@/components/captain/CaptainCoursePricing";
import { CaptainCars } from "@/components/captain/CaptainCars";

interface CaptainProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  governorate_id: string;
  car_type: string;
  transmission_type: string;
  car_photo_url: string;
  personal_photo_url: string;
  hourly_rate: number;
  bio: string;
  is_available: boolean;
  rating: number;
  total_sessions: number;
}

interface Governorate {
  id: string;
  name: string;
}

const CaptainDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CaptainProfile | null>(null);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    governorate_id: "",
    car_type: "",
    transmission_type: "",
    hourly_rate: 100,
    bio: "",
    is_available: true,
    driving_license_expiry: "",
    car_license_expiry: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchGovernorates();
      fetchUnreadNotifications();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("captain_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          governorate_id: data.governorate_id || "",
          car_type: data.car_type || "",
          transmission_type: data.transmission_type || "",
          hourly_rate: data.hourly_rate || 100,
          bio: data.bio || "",
          is_available: data.is_available,
          driving_license_expiry: data.driving_license_expiry || "",
          car_license_expiry: data.car_license_expiry || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGovernorates = async () => {
    const { data } = await supabase.from("governorates").select("*").order("name");
    if (data) setGovernorates(data);
  };

  const fetchUnreadNotifications = async () => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id)
      .eq("is_read", false);
    setUnreadNotifications(count || 0);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    if (!formData.full_name.trim()) {
      toast.error("الاسم الكامل مطلوب");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("رقم الهاتف مطلوب");
      return;
    }
    if (!formData.governorate_id) {
      toast.error("يرجى اختيار المحافظة");
      return;
    }
    if (!formData.car_type.trim()) {
      toast.error("نوع السيارة مطلوب");
      return;
    }
    if (!formData.transmission_type) {
      toast.error("يرجى اختيار نوع ناقل الحركة");
      return;
    }
    if (!formData.bio.trim()) {
      toast.error("النبذة الشخصية مطلوبة");
      return;
    }
    if (!formData.driving_license_expiry) {
      toast.error("تاريخ انتهاء رخصة القيادة مطلوب");
      return;
    }
    if (!formData.car_license_expiry) {
      toast.error("تاريخ انتهاء رخصة السيارة مطلوب");
      return;
    }
    
    setSaving(true);

    try {
      const profileData = {
        user_id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        governorate_id: formData.governorate_id || null,
        car_type: formData.car_type,
        transmission_type: formData.transmission_type || null,
        hourly_rate: formData.hourly_rate,
        bio: formData.bio,
        is_available: formData.is_available,
        driving_license_expiry: formData.driving_license_expiry || null,
        car_license_expiry: formData.car_license_expiry || null,
      };

      if (profile) {
        const { error } = await supabase
          .from("captain_profiles")
          .update(profileData)
          .eq("id", profile.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("captain_profiles")
          .insert(profileData)
          .select()
          .single();
        if (error) throw error;
        setProfile(data);
      }

      toast.success("تم حفظ البيانات بنجاح");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">لوحة تحكم الكابتن</h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <AdminSupportButton />
            <Badge variant={formData.is_available ? "default" : "secondary"}>
              {formData.is_available ? "متاح للحجز" : "غير متاح"}
            </Badge>
            {profile && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{profile.rating?.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">بياناتي</span>
            </TabsTrigger>
            <TabsTrigger value="cars" className="gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">سياراتي</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">الكورسات</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">المواعيد</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">الحجوزات</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">المحفظة</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2 relative">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">المحادثات</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">الشروط</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    البيانات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>الاسم الكامل <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="أدخل رقم هاتفك"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المحافظة <span className="text-destructive">*</span></Label>
                    <Select
                      value={formData.governorate_id}
                      onValueChange={(value) => setFormData({ ...formData, governorate_id: value })}
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
                    <Label>نبذة عنك <span className="text-destructive">*</span></Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="اكتب نبذة مختصرة عن خبرتك..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>تاريخ انتهاء رخصة القيادة <span className="text-destructive">*</span></Label>
                    <Input
                      type="date"
                      value={formData.driving_license_expiry}
                      onChange={(e) => setFormData({ ...formData, driving_license_expiry: e.target.value })}
                    />
                    {formData.driving_license_expiry && new Date(formData.driving_license_expiry) <= new Date() && (
                      <p className="text-sm text-destructive font-medium">⚠️ رخصة القيادة منتهية!</p>
                    )}
                    {formData.driving_license_expiry && new Date(formData.driving_license_expiry) > new Date() && new Date(formData.driving_license_expiry) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <p className="text-sm text-yellow-600 font-medium">⚠️ رخصة القيادة ستنتهي قريباً</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>تاريخ انتهاء رخصة السيارة (الترخيص) <span className="text-destructive">*</span></Label>
                    <Input
                      type="date"
                      value={formData.car_license_expiry}
                      onChange={(e) => setFormData({ ...formData, car_license_expiry: e.target.value })}
                    />
                    {formData.car_license_expiry && new Date(formData.car_license_expiry) <= new Date() && (
                      <p className="text-sm text-destructive font-medium">⚠️ رخصة السيارة منتهية!</p>
                    )}
                    {formData.car_license_expiry && new Date(formData.car_license_expiry) > new Date() && new Date(formData.car_license_expiry) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <p className="text-sm text-yellow-600 font-medium">⚠️ رخصة السيارة ستنتهي قريباً</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    بيانات السيارة والتسعير
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>نوع السيارة <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.car_type}
                      onChange={(e) => setFormData({ ...formData, car_type: e.target.value })}
                      placeholder="مثال: تويوتا كورولا 2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>نوع ناقل الحركة</Label>
                    <Select
                      value={formData.transmission_type}
                      onValueChange={(value) => setFormData({ ...formData, transmission_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع ناقل الحركة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">مانيوال</SelectItem>
                        <SelectItem value="automatic">أوتوماتيك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>سعر الساعة (جنيه)</Label>
                    <Input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_available"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_available">متاح للحجز حالياً</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inline Cars Management in Profile Tab */}
            {profile && (
              <div className="mt-6">
                <CaptainCars captainId={profile.id} />
              </div>
            )}

            <div className="mt-6">
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full md:w-auto">
                {saving ? "جاري الحفظ..." : "حفظ البيانات"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="cars">
            {profile ? (
              <CaptainCars captainId={profile.id} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">يرجى حفظ بياناتك الشخصية أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pricing">
            {profile ? (
              <CaptainCoursePricing captainId={profile.id} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">يرجى حفظ بياناتك الشخصية أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule">
            {profile ? (
              <CaptainSchedule captainId={profile.id} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">يرجى حفظ بياناتك الشخصية أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {profile ? (
              <CaptainBookings captainId={profile.id} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">يرجى حفظ بياناتك الشخصية أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallet">
            {profile ? (
              <CaptainWallet captainId={profile.id} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">يرجى حفظ بياناتك الشخصية أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages">
            {profile ? (
              <ChatList captainId={profile.id} userId={user?.id || ""} role="captain" />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">يرجى حفظ بياناتك الشخصية أولاً</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  الشروط والأحكام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <h3 className="text-foreground font-semibold">سياسات الاستخدام الهامة:</h3>
                  <ul className="space-y-2 mt-3">
                    <li>• <strong>الالتزام بالمواعيد:</strong> تُحسب الحصة على العميل في حال الإلغاء قبل الموعد بأقل من ساعة أو في حال التأخر.</li>
                    <li>• <strong>منع اصطحاب الأطفال:</strong> يمنع اصطحاب الأطفال أثناء التدريب.</li>
                    <li>• <strong>شرط العمر للمرافق:</strong> يجب أن يكون عمر المرافق 18 سنة على الأقل.</li>
                    <li>• <strong>نقطة التدريب:</strong> المدرب هو المسؤول عن تحديد نقطة بداية ونهاية التدريب.</li>
                    <li>• <strong>تأجيل الكورس:</strong> في حال تأجيل الكورس، الحد الأقصى هو 3 أشهر قبل إلغاء التعاقد.</li>
                    <li>• <strong>إلغاء الكورس:</strong> لا يمكن إلغاء الكورس بعد بدء التدريب العملي.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <Link to="/terms">
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      عرض الشروط والأحكام الكاملة
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaptainDashboard;
