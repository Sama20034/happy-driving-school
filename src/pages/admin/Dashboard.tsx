import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, MapPin, Building2, BookOpen, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  bookings: number;
  governorates: number;
  branches: number;
  courses: number;
  captains: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    bookings: 0,
    governorates: 0,
    branches: 0,
    courses: 0,
    captains: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [bookings, governorates, branches, courses, captains] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("governorates").select("id", { count: "exact", head: true }),
        supabase.from("branches").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("captain_profiles").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        bookings: bookings.count || 0,
        governorates: governorates.count || 0,
        branches: branches.count || 0,
        courses: courses.count || 0,
        captains: captains.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "الحجوزات", value: stats.bookings, icon: Calendar, color: "text-blue-500" },
    { title: "المحافظات", value: stats.governorates, icon: MapPin, color: "text-green-500" },
    { title: "الفروع", value: stats.branches, icon: Building2, color: "text-purple-500" },
    { title: "الكورسات", value: stats.courses, icon: BookOpen, color: "text-orange-500" },
    { title: "الكباتن", value: stats.captains, icon: Users, color: "text-pink-500" },
  ];

  return (
    <>
      <Helmet>
        <title>لوحة التحكم | كابتن مصر</title>
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">مرحباً بك في لوحة إدارة النظام</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {loading ? "..." : stat.value}
              </h3>
              <p className="text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
