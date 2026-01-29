import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare, Bell, MapPin, Star, Car, Clock, FileText } from "lucide-react";
import { CaptainCard } from "@/components/trainee/CaptainCard";
import { TraineeBookings } from "@/components/trainee/TraineeBookings";
import { ChatList } from "@/components/chat/ChatList";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { AdminSupportButton } from "@/components/chat/AdminSupportButton";

interface Captain {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  governorate_id: string;
  governorate_name?: string;
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

const TraineeDashboard = () => {
  const { user } = useAuth();
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchGovernorates();
    fetchCaptains();
    if (user) {
      fetchUnreadNotifications();
    }
  }, [user]);

  useEffect(() => {
    fetchCaptains();
  }, [selectedGovernorate]);

  const fetchGovernorates = async () => {
    const { data } = await supabase.from("governorates").select("*").order("name");
    if (data) setGovernorates(data);
  };

  const fetchCaptains = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("captain_profiles")
        .select(`
          *,
          governorates!captain_profiles_governorate_id_fkey(name)
        `)
        .eq("is_available", true);

      if (selectedGovernorate && selectedGovernorate !== "all") {
        query = query.eq("governorate_id", selectedGovernorate);
      }

      const { data, error } = await query.order("rating", { ascending: false });

      if (error) throw error;

      const captainsWithGov = data?.map((captain: any) => ({
        ...captain,
        governorate_name: captain.governorates?.name,
      })) || [];

      setCaptains(captainsWithGov);
    } catch (error) {
      console.error("Error fetching captains:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotifications = async () => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id)
      .eq("is_read", false);
    setUnreadNotifications(count || 0);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">مرحباً بك</h1>
          <AdminSupportButton />
        </div>

        <Tabs defaultValue="captains" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="captains" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">الكباتن</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">حجوزاتي</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">المحادثات</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 relative">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">الإشعارات</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="terms" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">الشروط</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="captains">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">فلتر بالمحافظة:</span>
                  </div>
                  <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder="جميع المحافظات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المحافظات</SelectItem>
                      {governorates.map((gov) => (
                        <SelectItem key={gov.id} value={gov.id}>
                          {gov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-64"></CardContent>
                  </Card>
                ))}
              </div>
            ) : captains.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا يوجد كباتن متاحين في هذه المحافظة حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {captains.map((captain) => (
                  <CaptainCard key={captain.id} captain={captain} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <TraineeBookings userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="messages">
            <ChatList userId={user?.id || ""} role="trainee" />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList userId={user?.id || ""} onRead={fetchUnreadNotifications} />
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

export default TraineeDashboard;
