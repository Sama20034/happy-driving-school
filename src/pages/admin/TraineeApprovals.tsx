import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Eye, UserCircle, CreditCard, CheckCircle, XCircle, Loader2, Trash2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import MobileUserCard from "@/components/admin/MobileUserCard";

interface TraineeUser {
  id: string;
  user_id: string;
  full_name: string | null;
  approval_status: string;
  id_card_url: string | null;
  personal_photo_url: string | null;
  phone: string | null;
  created_at: string;
}

const TraineeApprovals = () => {
  const [trainees, setTrainees] = useState<TraineeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<TraineeUser | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TraineeUser | null>(null);

  const fetchTrainees = async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      setLoading(false);
      return;
    }

    const usersWithRoles = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.user_id)
          .maybeSingle();
        return { ...profile, role: roleData?.role || 'trainee' };
      })
    );

    const traineeUsers = usersWithRoles.filter(u => u.role === 'trainee' || u.role === 'user');
    setTrainees(traineeUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handleApprove = async (user: TraineeUser) => {
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true, approval_status: 'approved' })
      .eq('user_id', user.user_id);
    if (error) toast.error('حدث خطأ أثناء الموافقة');
    else { toast.success('تم قبول المتدرب بنجاح'); fetchTrainees(); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: false, approval_status: 'rejected', rejection_reason: rejectionReason })
      .eq('user_id', selectedUser.user_id);
    if (error) toast.error('حدث خطأ أثناء الرفض');
    else { toast.success('تم رفض المتدرب'); setShowRejectModal(false); setRejectionReason(""); setSelectedUser(null); fetchTrainees(); }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('user_id', deleteTarget.user_id);
      if (error) {
        await supabase.from('profiles').update({
          is_approved: false, approval_status: 'rejected', rejection_reason: 'تم حذف المستخدم من النظام'
        }).eq('user_id', deleteTarget.user_id);
      }
      toast.success('تم حذف المتدرب بنجاح');
      setShowDeleteConfirm(false); setDeleteTarget(null); fetchTrainees();
    } catch { toast.error('حدث خطأ أثناء الحذف'); }
    finally { setActionLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">مقبول</Badge>;
      case 'rejected': return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">مرفوض</Badge>;
      default: return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">قيد الانتظار</Badge>;
    }
  };

  const pendingCount = trainees.filter(u => u.approval_status === 'pending').length;

  return (
    <>
      <Helmet>
        <title>المتدربين | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">المتدربين</h1>
          <p className="text-muted-foreground">
            إدارة حسابات المتدربين
            {pendingCount > 0 && <span className="mr-2 text-primary font-semibold">({pendingCount} طلب جديد)</span>}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trainees.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <UserCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا يوجد متدربين مسجلين</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-right font-semibold">المتدرب</th>
                    <th className="px-6 py-4 text-right font-semibold">الحالة</th>
                    <th className="px-6 py-4 text-right font-semibold">تاريخ التسجيل</th>
                    <th className="px-6 py-4 text-right font-semibold">عرض</th>
                    <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {trainees.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.personal_photo_url ? (
                            <img src={user.personal_photo_url} alt={user.full_name || ''} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium">{user.full_name || 'بدون اسم'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(user.approval_status)}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setShowDocuments(true); }}>
                          <Eye className="h-4 w-4 ml-2" />عرض
                        </Button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap items-center">
                          {user.approval_status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(user)} disabled={actionLoading}>
                                <Check className="h-4 w-4 ml-1" />قبول
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(user); setShowRejectModal(true); }} disabled={actionLoading}>
                                <X className="h-4 w-4 ml-1" />رفض
                              </Button>
                            </>
                          )}
                          {user.approval_status === 'approved' && (
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                              <CheckCircle className="h-3 w-3 ml-1" />تم القبول
                            </Badge>
                          )}
                          {user.approval_status === 'rejected' && (
                            <>
                              <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                                <XCircle className="h-3 w-3 ml-1" />مرفوض
                              </Badge>
                              <Button size="icon" variant="ghost" title="إعادة القبول" onClick={() => handleApprove(user)} disabled={actionLoading}>
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                            </>
                          )}
                          <Button size="icon" variant="ghost" title="حذف" onClick={() => { setDeleteTarget(user); setShowDeleteConfirm(true); }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Documents Modal */}
      <Dialog open={showDocuments} onOpenChange={setShowDocuments}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>بيانات المتدرب - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["صورة البطاقة", "الصورة الشخصية"].map((title, i) => {
                const url = i === 0 ? selectedUser?.id_card_url : selectedUser?.personal_photo_url;
                return (
                  <div key={title} className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      {i === 0 ? <CreditCard className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />}
                      {title}
                    </h4>
                    {url ? (
                      <img src={url} alt={title} className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                        onClick={() => setPreviewImage(url)} />
                    ) : (
                      <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground h-40 flex items-center justify-center text-sm">لم يتم الرفع</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>رفض المتدرب - {selectedUser?.full_name}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea placeholder="سبب الرفض (اختياري)..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="min-h-[100px]" />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}تأكيد الرفض
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-2">
          <DialogHeader className="sr-only"><DialogTitle>عرض الصورة</DialogTitle></DialogHeader>
          {previewImage && <img src={previewImage} alt="Preview" className="w-full h-full max-h-[85vh] object-contain rounded-lg" />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المتدرب</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف {deleteTarget?.full_name}؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" disabled={actionLoading}>
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TraineeApprovals;
