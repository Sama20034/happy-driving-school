import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Star, Eye, Trash2, MapPin, Car, Phone, Check, X, Loader2, UserCircle, Ban, PauseCircle, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CaptainProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  governorate_id: string | null;
  car_type: string | null;
  transmission_type: string | null;
  car_photo_url: string | null;
  personal_photo_url: string | null;
  hourly_rate: number;
  bio: string | null;
  is_available: boolean;
  rating: number | null;
  total_sessions: number | null;
  created_at: string;
  status: string;
  governorates?: { name: string } | null;
}

type ActionType = "delete" | "ban" | "suspend" | "activate";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "نشط", className: "bg-green-500/20 text-green-600 border-green-500/30" },
  suspended: { label: "معلّق", className: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" },
  banned: { label: "محظور", className: "bg-red-500/20 text-red-600 border-red-500/30" },
};

const Captains = () => {
  const [captains, setCaptains] = useState<CaptainProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaptain, setSelectedCaptain] = useState<CaptainProfile | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<ActionType>("delete");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCaptains = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("captain_profiles")
      .select(`*, governorates (name)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("خطأ في تحميل الكباتن");
    } else {
      setCaptains(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCaptains(); }, []);

  const confirmAction = (id: string, type: ActionType) => {
    setTargetId(id);
    setActionType(type);
    setShowConfirm(true);
  };

  const actionMessages: Record<ActionType, { title: string; desc: string; btn: string; success: string }> = {
    delete: { title: "تأكيد حذف الكابتن", desc: "سيتم حذف الكابتن نهائياً ولن يمكن التراجع.", btn: "حذف نهائي", success: "تم حذف الكابتن" },
    ban: { title: "تأكيد حظر الكابتن", desc: "سيتم حظر الكابتن ولن يظهر للمتدربين.", btn: "حظر الكابتن", success: "تم حظر الكابتن" },
    suspend: { title: "تأكيد تعليق الكابتن", desc: "سيتم تعليق الكابتن مؤقتاً.", btn: "تعليق الكابتن", success: "تم تعليق الكابتن" },
    activate: { title: "تأكيد تفعيل الكابتن", desc: "سيتم إعادة تفعيل الكابتن.", btn: "تفعيل الكابتن", success: "تم تفعيل الكابتن" },
  };

  const handleAction = async () => {
    if (!targetId) return;
    setActionLoading(true);

    try {
      const captain = captains.find(c => c.id === targetId);
      if (!captain) throw new Error("Captain not found");

      if (actionType === "delete") {
        const { error } = await supabase.from("captain_profiles").delete().eq("id", targetId);
        if (error) throw error;

        await supabase.from("user_roles").update({ role: "trainee" }).eq("user_id", captain.user_id);
        await supabase.from("profiles").update({ 
          is_approved: false, approval_status: "rejected",
          rejection_reason: "تم حذف الكابتن من النظام"
        }).eq("user_id", captain.user_id);
      } else {
        const newStatus = actionType === "ban" ? "banned" : actionType === "suspend" ? "suspended" : "active";
        const { error } = await supabase.from("captain_profiles").update({ 
          status: newStatus,
          is_available: newStatus === "active" 
        }).eq("id", targetId);
        if (error) throw error;
      }

      toast.success(actionMessages[actionType].success);
      setShowConfirm(false);
      setTargetId(null);
      fetchCaptains();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء تنفيذ الإجراء");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (captain: CaptainProfile) => {
    const config = statusConfig[captain.status] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <>
      <Helmet><title>إدارة الكباتن | لوحة التحكم</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة الكباتن</h1>
          <p className="text-muted-foreground">
            عرض وإدارة الكباتن المسجلين
            <span className="mr-2 text-primary font-semibold">({captains.length} كابتن)</span>
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : captains.length === 0 ? (
            <div className="p-12 text-center">
              <UserCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا يوجد كباتن مسجلين</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصورة</TableHead>
                  <TableHead className="text-right">اسم الكابتن</TableHead>
                  <TableHead className="text-right">المحافظة</TableHead>
                  <TableHead className="text-right">السيارة</TableHead>
                  <TableHead className="text-right">سعر الساعة</TableHead>
                  <TableHead className="text-right">التقييم</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captains.map((captain) => (
                  <TableRow key={captain.id} className={captain.status === "banned" ? "opacity-60" : ""}>
                    <TableCell>
                      {captain.personal_photo_url ? (
                        <img src={captain.personal_photo_url} alt={captain.full_name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{captain.full_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {captain.governorates?.name || "غير محدد"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{captain.car_type || "غير محدد"}</span>
                        {captain.transmission_type && (
                          <Badge variant="outline" className="text-xs">
                            {captain.transmission_type === "automatic" ? "أوتوماتيك" : "مانيوال"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">{captain.hourly_rate} جنيه</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span>{captain.rating?.toFixed(1) || "5.0"}</span>
                        <span className="text-muted-foreground text-xs">({captain.total_sessions || 0})</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(captain)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setSelectedCaptain(captain); setShowDetails(true); }} title="عرض">
                          <Eye size={16} />
                        </Button>
                        {captain.status !== "active" ? (
                          <Button size="icon" variant="ghost" onClick={() => confirmAction(captain.id, "activate")} title="تفعيل">
                            <PlayCircle size={16} className="text-green-500" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" onClick={() => confirmAction(captain.id, "suspend")} title="تعليق">
                            <PauseCircle size={16} className="text-yellow-500" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => confirmAction(captain.id, "ban")} title="حظر" className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10">
                          <Ban size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => confirmAction(captain.id, "delete")} title="حذف نهائي" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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

      {/* Captain Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الكابتن</DialogTitle>
          </DialogHeader>
          {selectedCaptain && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                {selectedCaptain.personal_photo_url ? (
                  <img src={selectedCaptain.personal_photo_url} alt={selectedCaptain.full_name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{selectedCaptain.full_name}</h3>
                  {selectedCaptain.phone && (
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      <span dir="ltr">{selectedCaptain.phone}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(selectedCaptain)}
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span>{selectedCaptain.rating?.toFixed(1) || "5.0"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">المحافظة</p>
                  <p className="font-medium">{selectedCaptain.governorates?.name || "غير محدد"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">سعر الساعة</p>
                  <p className="font-medium text-primary">{selectedCaptain.hourly_rate} جنيه</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نوع السيارة</p>
                  <p className="font-medium">{selectedCaptain.car_type || "غير محدد"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ناقل الحركة</p>
                  <p className="font-medium">
                    {selectedCaptain.transmission_type === "automatic" ? "أوتوماتيك" : 
                     selectedCaptain.transmission_type === "manual" ? "مانيوال" : "غير محدد"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عدد الجلسات</p>
                  <p className="font-medium">{selectedCaptain.total_sessions || 0} جلسة</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                  <p className="font-medium">{new Date(selectedCaptain.created_at).toLocaleDateString("ar-EG")}</p>
                </div>
              </div>

              {selectedCaptain.bio && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">نبذة عن الكابتن</p>
                  <p className="bg-muted/30 p-4 rounded-lg">{selectedCaptain.bio}</p>
                </div>
              )}

              {selectedCaptain.car_photo_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">صورة السيارة</p>
                  <img src={selectedCaptain.car_photo_url} alt="صورة السيارة" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionMessages[actionType].title}</AlertDialogTitle>
            <AlertDialogDescription>{actionMessages[actionType].desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === "activate" ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90"}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {actionMessages[actionType].btn}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Captains;
