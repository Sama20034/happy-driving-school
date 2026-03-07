import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Eye, UserCircle, CreditCard, Clock, CheckCircle, XCircle, Loader2, FileText, Car, Camera, Trash2, RotateCcw, Phone, Calendar, MapPin, Star, DollarSign, GraduationCap } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import MobileUserCard from "@/components/admin/MobileUserCard";

interface CaptainUser {
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
  phone: string | null;
  created_at: string;
}

interface CaptainProfile {
  id: string;
  full_name: string;
  phone: string | null;
  hourly_rate: number;
  rating: number | null;
  total_sessions: number | null;
  is_available: boolean;
  status: string;
  bio: string | null;
  car_type: string | null;
  transmission_type: string | null;
  governorate_id: string | null;
  created_at: string;
  driving_license_expiry: string | null;
  car_license_expiry: string | null;
}

interface ScheduleSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface CoursePrice {
  course_type: string;
  session_price: number;
}

interface CarInfo {
  car_type: string;
  transmission_type: string;
  car_photo_url: string | null;
  is_primary: boolean;
}

const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const COURSE_CONFIG: Record<string, { name: string; sessions: number }> = {
  practice: { name: "كورس الممارسة", sessions: 6 },
  beginner: { name: "كورس المبتدئين", sessions: 8 },
  professional: { name: "كورس الاحتراف", sessions: 10 }
};

const CaptainApprovals = () => {
  const [captains, setCaptains] = useState<CaptainUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<CaptainUser | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CaptainUser | null>(null);

  // Detail modal data
  const [captainProfile, setCaptainProfile] = useState<CaptainProfile | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [coursePrices, setCoursePrices] = useState<CoursePrice[]>([]);
  const [cars, setCars] = useState<CarInfo[]>([]);
  const [govName, setGovName] = useState<string>("");
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchCaptains = async () => {
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

    const captainUsers = usersWithRoles.filter(u => u.role === 'captain');
    setCaptains(captainUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchCaptains();
  }, []);

  const fetchCaptainDetails = async (userId: string) => {
    setDetailLoading(true);
    
    // Fetch captain profile
    const { data: profile } = await supabase
      .from('captain_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    setCaptainProfile(profile);

    if (profile) {
      // Fetch governorate name
      if (profile.governorate_id) {
        const { data: gov } = await supabase
          .from('governorates')
          .select('name')
          .eq('id', profile.governorate_id)
          .maybeSingle();
        setGovName(gov?.name || "");
      } else {
        setGovName("");
      }

      // Fetch schedule
      const { data: scheduleData } = await supabase
        .from('captain_schedule')
        .select('day_of_week, start_time, end_time, is_active')
        .eq('captain_id', profile.id)
        .order('day_of_week');
      setSchedule(scheduleData || []);

      // Fetch course prices
      const { data: pricesData } = await supabase
        .from('captain_course_prices')
        .select('course_type, session_price')
        .eq('captain_id', profile.id);
      setCoursePrices(pricesData || []);

      // Fetch cars
      const { data: carsData } = await supabase
        .from('captain_cars')
        .select('car_type, transmission_type, car_photo_url, is_primary')
        .eq('captain_id', profile.id);
      setCars(carsData || []);
    }

    setDetailLoading(false);
  };

  const handleViewDetails = async (user: CaptainUser) => {
    setSelectedUser(user);
    setShowDetails(true);
    await fetchCaptainDetails(user.user_id);
  };

  const handleApprove = async (user: CaptainUser) => {
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true, approval_status: 'approved' })
      .eq('user_id', user.user_id);

    if (error) {
      toast.error('حدث خطأ أثناء الموافقة');
    } else {
      toast.success('تم قبول الكابتن بنجاح');
      fetchCaptains();
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: false, approval_status: 'rejected', rejection_reason: rejectionReason })
      .eq('user_id', selectedUser.user_id);

    if (error) {
      toast.error('حدث خطأ أثناء الرفض');
    } else {
      toast.success('تم رفض الكابتن');
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedUser(null);
      fetchCaptains();
    }
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
      toast.success('تم حذف الكابتن بنجاح');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      fetchCaptains();
    } catch {
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

  const pendingCount = captains.filter(u => u.approval_status === 'pending').length;

  const DocumentCard = ({ title, icon: Icon, url }: { title: string; icon: React.ElementType; url: string | null }) => (
    <div className="space-y-2">
      <h4 className="font-semibold flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        {title}
      </h4>
      {url ? (
        <img src={url} alt={title} className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setPreviewImage(url)} />
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
        <title>موافقات الكباتن | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">موافقات الكباتن</h1>
          <p className="text-muted-foreground">
            إدارة طلبات تسجيل الكباتن
            {pendingCount > 0 && (
              <span className="mr-2 text-primary font-semibold">({pendingCount} طلب جديد)</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : captains.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <UserCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا يوجد كباتن مسجلين</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {captains.map((user) => (
                <MobileUserCard
                  key={user.id}
                  user={user}
                  onView={() => handleViewDetails(user)}
                  onApprove={() => handleApprove(user)}
                  onReject={() => { setSelectedUser(user); setShowRejectModal(true); }}
                  onDelete={() => { setDeleteTarget(user); setShowDeleteConfirm(true); }}
                  actionLoading={actionLoading}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-right font-semibold">الكابتن</th>
                      <th className="px-6 py-4 text-right font-semibold">الحالة</th>
                      <th className="px-6 py-4 text-right font-semibold">تاريخ التسجيل</th>
                      <th className="px-6 py-4 text-right font-semibold">عرض</th>
                      <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {captains.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.personal_photo_url ? (
                              <img src={user.personal_photo_url} alt={user.full_name || 'Captain'} className="w-10 h-10 rounded-full object-cover" />
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
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                            <Eye className="h-4 w-4 ml-2" />
                            عرض
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
                              <>
                                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                                  <CheckCircle className="h-3 w-3 ml-1" />تم القبول
                                </Badge>
                                <Button size="icon" variant="ghost" title="إعادة للمراجعة" onClick={() => { setSelectedUser(user); setShowRejectModal(true); }}>
                                  <RotateCcw className="h-4 w-4 text-yellow-500" />
                                </Button>
                              </>
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
          </>
        )}
      </div>

      {/* Captain Full Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              تفاصيل الكابتن - {selectedUser?.full_name}
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  البيانات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الاسم</p>
                    <p className="font-semibold">{captainProfile?.full_name || selectedUser?.full_name || 'غير محدد'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">رقم الهاتف</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {captainProfile?.phone || selectedUser?.phone || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">تاريخ التسجيل</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">المحافظة</p>
                    <p className="font-semibold flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {govName || selectedUser?.training_governorate_name || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">التقييم</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {captainProfile?.rating?.toFixed(1) || '5.0'} ({captainProfile?.total_sessions || 0} جلسة)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                    <p className="font-semibold">
                      {captainProfile?.is_available ? (
                        <Badge className="bg-green-500/20 text-green-600">متاح</Badge>
                      ) : (
                        <Badge variant="secondary">غير متاح</Badge>
                      )}
                    </p>
                  </div>
                </div>
                {captainProfile?.bio && (
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">نبذة</p>
                    <p className="text-sm">{captainProfile.bio}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  الأسعار
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">سعر الساعة</p>
                    <p className="font-bold text-primary text-lg">{captainProfile?.hourly_rate || 0} جنيه</p>
                  </div>
                </div>
                {coursePrices.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4" />
                      أسعار الكورسات
                    </h4>
                    <div className="grid gap-2">
                      {coursePrices.map((price) => {
                        const config = COURSE_CONFIG[price.course_type];
                        if (!config || price.session_price <= 0) return null;
                        const totalPrice = Math.round(price.session_price * config.sessions * 0.95);
                        return (
                          <div key={price.course_type} className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-lg text-sm">
                            <span>{config.name} ({config.sessions} حصص × {price.session_price} ج)</span>
                            <span className="font-bold text-primary">{totalPrice} جنيه</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Cars */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  السيارات
                </h3>
                {cars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars.map((car, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{car.car_type}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {car.transmission_type === 'automatic' || car.transmission_type === 'أوتوماتيك' ? 'أوتوماتيك' : 'مانيوال'}
                            </Badge>
                            {car.is_primary && <Badge className="bg-primary/20 text-primary">أساسية</Badge>}
                          </div>
                        </div>
                        {car.car_photo_url && (
                          <img src={car.car_photo_url} alt={car.car_type} className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80"
                            onClick={() => setPreviewImage(car.car_photo_url)} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">نوع السيارة</p>
                      <p className="font-semibold">{captainProfile?.car_type || selectedUser?.car_type || 'غير محدد'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ناقل الحركة</p>
                      <p className="font-semibold">
                        {(captainProfile?.transmission_type || selectedUser?.transmission_type) === 'manual' ? 'مانوال' :
                         (captainProfile?.transmission_type || selectedUser?.transmission_type) === 'automatic' ? 'أوتوماتيك' : 'غير محدد'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Schedule */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  جدول المواعيد المتاحة
                </h3>
                {schedule.length > 0 ? (
                  <div className="grid gap-2">
                    {schedule.filter(s => s.is_active).map((slot, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/50 px-4 py-2 rounded-lg text-sm">
                        <span className="font-medium">{DAY_NAMES[slot.day_of_week]}</span>
                        <span className="text-muted-foreground">
                          {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        </span>
                      </div>
                    ))}
                    {schedule.filter(s => s.is_active).length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">لا توجد مواعيد مفعّلة</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4 bg-muted/30 rounded-xl">لم يحدد مواعيد بعد</p>
                )}
              </div>

              <Separator />

              {/* License Expiry */}
              {captainProfile && (captainProfile.driving_license_expiry || captainProfile.car_license_expiry) && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">تواريخ انتهاء الرخص</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                      {captainProfile.driving_license_expiry && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">رخصة القيادة</p>
                          <p className="font-semibold">{new Date(captainProfile.driving_license_expiry).toLocaleDateString('ar-EG')}</p>
                        </div>
                      )}
                      {captainProfile.car_license_expiry && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">رخصة السيارة</p>
                          <p className="font-semibold">{new Date(captainProfile.car_license_expiry).toLocaleDateString('ar-EG')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-lg mb-3">المستندات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <DocumentCard title="صورة البطاقة" icon={CreditCard} url={selectedUser?.id_card_url || null} />
                  <DocumentCard title="الصورة الشخصية" icon={UserCircle} url={selectedUser?.personal_photo_url || null} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DocumentCard title="رخصة السيارة" icon={FileText} url={selectedUser?.car_license_url || null} />
                  <DocumentCard title="الرخصة الشخصية" icon={FileText} url={selectedUser?.driving_license_url || null} />
                  <DocumentCard title="صورة العربية" icon={Camera} url={selectedUser?.car_photo_url || null} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض الكابتن - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">سبب الرفض (اختياري)</label>
              <Textarea placeholder="اكتب سبب الرفض هنا..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="min-h-[100px]" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                تأكيد الرفض
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
            <AlertDialogTitle>تأكيد حذف الكابتن</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف {deleteTarget?.full_name}؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" disabled={actionLoading}>
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CaptainApprovals;
