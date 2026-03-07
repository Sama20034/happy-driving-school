import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Eye, UserCircle, CreditCard, Clock, CheckCircle, XCircle, Loader2, FileText, Car, Camera, Trash2, RotateCcw } from "lucide-react";
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

interface PendingUser {
  id: string;
  user_id: string;
  full_name: string | null;
  approval_status: string;
  id_card_url: string | null;
  personal_photo_url: string | null;
  car_license_url: string | null;
  driving_license_url: string | null;
  car_photo_url: string | null;
  car_type: string | null;
  transmission_type: string | null;
  training_governorate_id: string | null;
  training_governorate_name?: string | null;
  created_at: string;
  role: string;
}

const UserApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PendingUser | null>(null);

  const fetchPendingUsers = async () => {
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

    // Get roles and governorate names for each user
    const usersWithRoles = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.user_id)
          .maybeSingle();

        let governorateName = null;
        if (profile.training_governorate_id) {
          const { data: govData } = await supabase
            .from('governorates')
            .select('name')
            .eq('id', profile.training_governorate_id)
            .maybeSingle();
          governorateName = govData?.name;
        }

        return {
          ...profile,
          role: roleData?.role || 'trainee',
          training_governorate_name: governorateName
        };
      })
    );

    // Filter out admins
    const nonAdminUsers = usersWithRoles.filter(u => u.role !== 'admin');
    setPendingUsers(nonAdminUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (user: PendingUser) => {
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        is_approved: true,
        approval_status: 'approved'
      })
      .eq('user_id', user.user_id);

    if (error) {
      toast.error('حدث خطأ أثناء الموافقة');
    } else {
      toast.success('تم قبول المستخدم بنجاح');
      fetchPendingUsers();
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        is_approved: false,
        approval_status: 'rejected',
        rejection_reason: rejectionReason
      })
      .eq('user_id', selectedUser.user_id);

    if (error) {
      toast.error('حدث خطأ أثناء الرفض');
    } else {
      toast.success('تم رفض المستخدم');
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedUser(null);
      fetchPendingUsers();
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', deleteTarget.user_id);
      
      if (error) {
        await supabase.from('profiles').update({
          is_approved: false,
          approval_status: 'rejected',
          rejection_reason: 'تم حذف المستخدم من النظام'
        }).eq('user_id', deleteTarget.user_id);
      }
      
      toast.success('تم حذف المستخدم بنجاح');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      fetchPendingUsers();
    } catch (err) {
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">مقبول</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">مرفوض</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">قيد الانتظار</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'captain':
        return <Badge variant="outline" className="border-primary text-primary">كابتن</Badge>;
      default:
        return <Badge variant="outline">متدرب</Badge>;
    }
  };

  const pendingCount = pendingUsers.filter(u => u.approval_status === 'pending').length;

  const DocumentCard = ({ title, icon: Icon, url }: { title: string; icon: React.ElementType; url: string | null }) => (
    <div className="space-y-2">
      <h4 className="font-semibold flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        {title}
      </h4>
      {url ? (
        <img 
          src={url} 
          alt={title} 
          className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setPreviewImage(url)}
        />
      ) : (
        <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground h-40 flex items-center justify-center">
          <span className="text-sm">لم يتم الرفع</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>موافقات المستخدمين | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">موافقات المستخدمين</h1>
            <p className="text-muted-foreground">
              إدارة طلبات التسجيل الجديدة
              {pendingCount > 0 && (
                <span className="mr-2 text-primary font-semibold">
                  ({pendingCount} طلب جديد)
                </span>
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <UserCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا يوجد مستخدمين مسجلين</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-right font-semibold">المستخدم</th>
                    <th className="px-6 py-4 text-right font-semibold">النوع</th>
                    <th className="px-6 py-4 text-right font-semibold">الحالة</th>
                    <th className="px-6 py-4 text-right font-semibold">تاريخ التسجيل</th>
                    <th className="px-6 py-4 text-right font-semibold">المستندات</th>
                    <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.personal_photo_url ? (
                            <img 
                              src={user.personal_photo_url} 
                              alt={user.full_name || 'User'} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium">{user.full_name || 'بدون اسم'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4">{getStatusBadge(user.approval_status)}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDocuments(true);
                          }}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          عرض
                        </Button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap items-center">
                          {user.approval_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(user)}
                                disabled={actionLoading}
                              >
                                <Check className="h-4 w-4 ml-1" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowRejectModal(true);
                                }}
                                disabled={actionLoading}
                              >
                                <X className="h-4 w-4 ml-1" />
                                رفض
                              </Button>
                            </>
                          )}
                          {user.approval_status === 'approved' && (
                            <>
                              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                تم القبول
                              </Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="إعادة للمراجعة"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowRejectModal(true);
                                }}
                              >
                                <RotateCcw className="h-4 w-4 text-yellow-500" />
                              </Button>
                            </>
                          )}
                          {user.approval_status === 'rejected' && (
                            <>
                              <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                                <XCircle className="h-3 w-3 ml-1" />
                                مرفوض
                              </Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="إعادة القبول"
                                onClick={() => handleApprove(user)}
                                disabled={actionLoading}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            title="حذف"
                            onClick={() => {
                              setDeleteTarget(user);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
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
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              مستندات المستخدم - {selectedUser?.full_name}
              {selectedUser && getRoleBadge(selectedUser.role)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Common Documents */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">المستندات الأساسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard title="صورة البطاقة" icon={CreditCard} url={selectedUser?.id_card_url || null} />
                <DocumentCard title="الصورة الشخصية" icon={UserCircle} url={selectedUser?.personal_photo_url || null} />
              </div>
            </div>

            {/* Captain-specific Documents */}
            {selectedUser?.role === 'captain' && (
              <div>
                <h3 className="font-semibold mb-3 text-lg text-primary">بيانات الكابتن</h3>
                
                {/* Captain Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">نوع السيارة</p>
                    <p className="font-semibold">{selectedUser?.car_type || 'غير محدد'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">نوع ناقل الحركة</p>
                    <p className="font-semibold">
                      {selectedUser?.transmission_type === 'manual' ? 'مانوال' : 
                       selectedUser?.transmission_type === 'automatic' ? 'أوتوماتيك' : 'غير محدد'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">محافظة التدريب</p>
                    <p className="font-semibold">{selectedUser?.training_governorate_name || 'غير محدد'}</p>
                  </div>
                </div>
                
                <h4 className="font-medium mb-3 text-sm">مستندات الكابتن</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DocumentCard title="رخصة السيارة" icon={FileText} url={selectedUser?.car_license_url || null} />
                  <DocumentCard title="الرخصة الشخصية" icon={FileText} url={selectedUser?.driving_license_url || null} />
                  <DocumentCard title="صورة العربية" icon={Camera} url={selectedUser?.car_photo_url || null} />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض المستخدم - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">سبب الرفض (اختياري)</label>
              <Textarea
                placeholder="اكتب سبب الرفض هنا..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                تأكيد الرفض
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>عرض الصورة</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المستخدم</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف {deleteTarget?.full_name}؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserApprovals;
