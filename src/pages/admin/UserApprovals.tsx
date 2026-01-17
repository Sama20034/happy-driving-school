import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Eye, UserCircle, CreditCard, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface PendingUser {
  id: string;
  user_id: string;
  full_name: string | null;
  approval_status: string;
  id_card_url: string | null;
  personal_photo_url: string | null;
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

    // Get roles for each user
    const usersWithRoles = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.user_id)
          .maybeSingle();

        return {
          ...profile,
          role: roleData?.role || 'trainee'
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
                          disabled={!user.id_card_url && !user.personal_photo_url}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          عرض
                        </Button>
                      </td>
                      <td className="px-6 py-4">
                        {user.approval_status === 'pending' && (
                          <div className="flex gap-2">
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
                          </div>
                        )}
                        {user.approval_status === 'approved' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span>تم القبول</span>
                          </div>
                        )}
                        {user.approval_status === 'rejected' && (
                          <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" />
                            <span>مرفوض</span>
                          </div>
                        )}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مستندات المستخدم - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                صورة البطاقة
              </h4>
              {selectedUser?.id_card_url ? (
                <img 
                  src={selectedUser.id_card_url} 
                  alt="ID Card" 
                  className="w-full rounded-lg border"
                />
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground">
                  لم يتم رفع صورة البطاقة
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                الصورة الشخصية
              </h4>
              {selectedUser?.personal_photo_url ? (
                <img 
                  src={selectedUser.personal_photo_url} 
                  alt="Personal Photo" 
                  className="w-full rounded-lg border"
                />
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground">
                  لم يتم رفع الصورة الشخصية
                </div>
              )}
            </div>
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
    </>
  );
};

export default UserApprovals;
