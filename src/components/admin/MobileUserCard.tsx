import { UserCircle, Eye, Check, X, CheckCircle, XCircle, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MobileUserCardProps {
  user: {
    id: string;
    user_id: string;
    full_name: string | null;
    approval_status: string;
    personal_photo_url: string | null;
    created_at: string;
    role?: string;
  };
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  actionLoading: boolean;
  showRole?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved': return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">مقبول</Badge>;
    case 'rejected': return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">مرفوض</Badge>;
    default: return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">قيد الانتظار</Badge>;
  }
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'captain': return <Badge variant="outline" className="border-primary text-primary">كابتن</Badge>;
    default: return <Badge variant="outline">متدرب</Badge>;
  }
};

const MobileUserCard = ({ user, onView, onApprove, onReject, onDelete, actionLoading, showRole }: MobileUserCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {user.personal_photo_url ? (
            <img src={user.personal_photo_url} alt={user.full_name || ''} className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{user.full_name || 'بدون اسم'}</p>
            <p className="text-xs text-muted-foreground">{new Date(user.created_at).toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showRole && user.role && getRoleBadge(user.role)}
          {getStatusBadge(user.approval_status)}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onView} className="flex-1 min-w-[80px]">
          <Eye className="h-4 w-4 ml-1" />عرض
        </Button>

        {user.approval_status === 'pending' && (
          <>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1 min-w-[70px]" onClick={onApprove} disabled={actionLoading}>
              <Check className="h-4 w-4 ml-1" />قبول
            </Button>
            <Button size="sm" variant="destructive" className="flex-1 min-w-[70px]" onClick={onReject} disabled={actionLoading}>
              <X className="h-4 w-4 ml-1" />رفض
            </Button>
          </>
        )}

        {user.approval_status === 'approved' && (
          <Button size="icon" variant="ghost" title="إعادة للمراجعة" onClick={onReject}>
            <RotateCcw className="h-4 w-4 text-yellow-500" />
          </Button>
        )}

        {user.approval_status === 'rejected' && (
          <Button size="icon" variant="ghost" title="إعادة القبول" onClick={onApprove} disabled={actionLoading}>
            <Check className="h-4 w-4 text-green-500" />
          </Button>
        )}

        <Button size="icon" variant="ghost" title="حذف" onClick={onDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileUserCard;
