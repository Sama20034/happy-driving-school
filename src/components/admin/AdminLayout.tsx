import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "./AdminSidebar";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setCheckingAdmin(false);
    };

    if (!loading && user) {
      checkAdmin();
    } else if (!loading && !user) {
      setCheckingAdmin(false);
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !checkingAdmin) {
      if (!user) {
        navigate("/auth");
      } else if (isAdmin === false) {
        navigate("/");
      }
    }
  }, [user, isAdmin, loading, checkingAdmin, navigate]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
