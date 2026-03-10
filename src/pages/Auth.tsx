import { useState, useEffect } from "react";
import carExamplePhoto from "@/assets/car-example-photo.jpg";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, Mail, Lock, User, Car, GraduationCap, Upload, CreditCard, UserCircle, FileText, Camera, MapPin, Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = 'trainee' | 'captain';

type DocumentType = 'id_card' | 'personal_photo' | 'car_license' | 'driving_license' | 'car_photo';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('trainee');
  
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    meetingPoint: "",
    carType: "",
    transmissionType: "" as "manual" | "automatic" | "",
    trainingGovernorateId: "",
  });

  // Extra cars for captain registration (optional)
  const [extraCars, setExtraCars] = useState<{ car_type: string; transmission_type: string }[]>([]);
  const [showExtraCarForm, setShowExtraCarForm] = useState(false);
  const [newExtraCar, setNewExtraCar] = useState({ car_type: "", transmission_type: "" });

  const [governorates, setGovernorates] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchGovernorates = async () => {
      const { data } = await supabase
        .from('governorates')
        .select('id, name')
        .order('display_order');
      if (data) setGovernorates(data);
    };
    fetchGovernorates();
  }, []);

  // Document uploads - Common
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [personalPhotoFile, setPersonalPhotoFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [personalPhotoPreview, setPersonalPhotoPreview] = useState<string | null>(null);

  // Document uploads - Captain only
  const [carLicenseFile, setCarLicenseFile] = useState<File | null>(null);
  const [drivingLicenseFile, setDrivingLicenseFile] = useState<File | null>(null);
  const [carPhotoFile, setCarPhotoFile] = useState<File | null>(null);
  const [carLicensePreview, setCarLicensePreview] = useState<string | null>(null);
  const [drivingLicensePreview, setDrivingLicensePreview] = useState<string | null>(null);
  const [carPhotoPreview, setCarPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Don't redirect during signup process
    if (user && !loading && !isSigningUp) {
      navigate("/");
    }
  }, [user, loading, navigate, isSigningUp]);

  const handleFileChange = (file: File | null, type: DocumentType) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        switch (type) {
          case 'id_card':
            setIdCardFile(file);
            setIdCardPreview(preview);
            break;
          case 'personal_photo':
            setPersonalPhotoFile(file);
            setPersonalPhotoPreview(preview);
            break;
          case 'car_license':
            setCarLicenseFile(file);
            setCarLicensePreview(preview);
            break;
          case 'driving_license':
            setDrivingLicenseFile(file);
            setDrivingLicensePreview(preview);
            break;
          case 'car_photo':
            setCarPhotoFile(file);
            setCarPhotoPreview(preview);
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadDocument = async (file: File, userId: string, type: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('user-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const resetForm = () => {
    setIdCardFile(null);
    setPersonalPhotoFile(null);
    setIdCardPreview(null);
    setPersonalPhotoPreview(null);
    setCarLicenseFile(null);
    setDrivingLicenseFile(null);
    setCarPhotoFile(null);
    setCarLicensePreview(null);
    setDrivingLicensePreview(null);
    setCarPhotoPreview(null);
    setExtraCars([]);
    setShowExtraCarForm(false);
    setNewExtraCar({ car_type: "", transmission_type: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("بيانات الدخول غير صحيحة");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("تم تسجيل الدخول بنجاح");
          navigate("/");
        }
      } else {
        // Set signing up flag to prevent auto-redirect
        setIsSigningUp(true);
        
        // Validate captain-specific documents and fields
        if (selectedRole === 'captain') {
          // Validate required documents for captain only
          if (!idCardFile || !personalPhotoFile) {
            toast.error("يرجى رفع صورة البطاقة والصورة الشخصية");
            setIsSubmitting(false);
            setIsSigningUp(false);
            return;
          }
          if (!carLicenseFile || !drivingLicenseFile || !carPhotoFile) {
            toast.error("يرجى رفع جميع مستندات الكابتن المطلوبة");
            setIsSubmitting(false);
            setIsSigningUp(false);
            return;
          }
          if (!formData.carType || !formData.transmissionType || !formData.trainingGovernorateId || !formData.meetingPoint) {
            toast.error("يرجى ملء جميع بيانات الكابتن المطلوبة");
            setIsSubmitting(false);
            setIsSigningUp(false);
            return;
          }
        }

        const { error, data } = await signUp(formData.email, formData.password, formData.fullName, selectedRole);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("هذا البريد الإلكتروني مسجل بالفعل");
          } else {
            toast.error(error.message);
          }
          setIsSigningUp(false);
        } else if (data?.user) {
          // Only upload documents for captain
          if (selectedRole === 'captain' && idCardFile && personalPhotoFile && carLicenseFile && drivingLicenseFile && carPhotoFile) {
            const uploadPromises: Promise<string | null>[] = [
              uploadDocument(idCardFile, data.user.id, 'id_card'),
              uploadDocument(personalPhotoFile, data.user.id, 'personal_photo'),
              uploadDocument(carLicenseFile, data.user.id, 'car_license'),
              uploadDocument(drivingLicenseFile, data.user.id, 'driving_license'),
              uploadDocument(carPhotoFile, data.user.id, 'car_photo')
            ];

            const uploadedUrls = await Promise.all(uploadPromises);
            const [idCardUrl, personalPhotoUrl, carLicenseUrl, drivingLicenseUrl, carPhotoUrl] = uploadedUrls;

            // Update profile with document URLs for captain
            const updateData: Record<string, string | null> = {
              id_card_url: idCardUrl,
              personal_photo_url: personalPhotoUrl,
              car_license_url: carLicenseUrl || null,
              driving_license_url: drivingLicenseUrl || null,
              car_photo_url: carPhotoUrl || null,
              car_type: formData.carType,
              transmission_type: formData.transmissionType,
              training_governorate_id: formData.trainingGovernorateId,
              meeting_point: formData.meetingPoint || null
            };

            await supabase
              .from('profiles')
              .update(updateData)
              .eq('user_id', data.user.id);
          }

          toast.success("تم إنشاء الحساب بنجاح! في انتظار موافقة الإدارة");
          setIsSigningUp(false);
          navigate("/pending-approval");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const DocumentUploadField = ({ 
    id, 
    label, 
    icon: Icon, 
    preview, 
    type 
  }: { 
    id: string; 
    label: string; 
    icon: React.ElementType; 
    preview: string | null; 
    type: DocumentType;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      <div 
        className={`relative border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all hover:border-primary/50 ${
          preview ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onClick={() => document.getElementById(id)?.click()}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null, type)}
        />
        {preview ? (
          <img src={preview} alt={label} className="max-h-24 mx-auto rounded-lg" />
        ) : (
          <div className="py-3">
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">اضغط للرفع</p>
          </div>
        )}
      </div>
      {type === 'car_photo' && !preview && (
        <div className="mt-1 p-2 bg-secondary/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center mb-1.5">📸 مثال للصورة المطلوبة:</p>
          <img 
            src={carExamplePhoto} 
            alt="مثال لصورة السيارة" 
            className="w-full h-20 object-cover rounded-md opacity-80"
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"} | كابتن مصر</title>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <div className="w-full max-w-lg mx-4">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? "أهلاً بك مرة أخرى" : "انضم إلينا الآن"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection - Only show on signup */}
              {!isLogin && (
                <div className="space-y-3">
                  <Label>نوع الحساب</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('trainee')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === 'trainee'
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedRole === 'trainee' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <GraduationCap size={24} />
                      </div>
                      <span className={`font-semibold text-sm ${selectedRole === 'trainee' ? 'text-primary' : ''}`}>
                        متدرب
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('captain')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === 'captain'
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedRole === 'captain' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <Car size={24} />
                      </div>
                      <span className={`font-semibold text-sm ${selectedRole === 'captain' ? 'text-primary' : ''}`}>
                        كابتن
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      className="pr-10 text-right rounded-xl h-12"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}


              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="pr-10 text-right rounded-xl h-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10 pl-10 text-right rounded-xl h-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Document Upload - Only show on signup for captain */}
              {!isLogin && selectedRole === 'captain' && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">المستندات المطلوبة *</Label>
                  
                  {/* Common Documents for Captain */}
                  <div className="grid grid-cols-2 gap-3">
                    <DocumentUploadField
                      id="idCardInput"
                      label="صورة البطاقة"
                      icon={CreditCard}
                      preview={idCardPreview}
                      type="id_card"
                    />
                    <DocumentUploadField
                      id="personalPhotoInput"
                      label="صورة شخصية"
                      icon={UserCircle}
                      preview={personalPhotoPreview}
                      type="personal_photo"
                    />
                  </div>

                  {/* Captain-specific Documents */}
                  <Label className="text-sm text-primary font-medium">بيانات الكابتن الإضافية *</Label>
                  
                  {/* Captain Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4" />
                        نوع السيارة *
                      </Label>
                      <Input
                        placeholder="مثال: تويوتا كورولا"
                        value={formData.carType}
                        onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                        className="text-right rounded-xl h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4" />
                        نوع ناقل الحركة *
                      </Label>
                      <Select
                        value={formData.transmissionType}
                        onValueChange={(value: "manual" | "automatic") => 
                          setFormData({ ...formData, transmissionType: value })
                        }
                      >
                        <SelectTrigger className="text-right rounded-xl h-10">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">مانوال</SelectItem>
                          <SelectItem value="automatic">أوتوماتيك</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        محافظة التدريب *
                      </Label>
                      <Select
                        value={formData.trainingGovernorateId}
                        onValueChange={(value) => 
                          setFormData({ ...formData, trainingGovernorateId: value })
                        }
                      >
                        <SelectTrigger className="text-right rounded-xl h-10">
                          <SelectValue placeholder="اختر المحافظة" />
                        </SelectTrigger>
                        <SelectContent>
                          {governorates.map((gov) => (
                            <SelectItem key={gov.id} value={gov.id}>{gov.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Meeting Point for Captain */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      نقطة الالتقاء للتدريب *
                    </Label>
                    <Input
                      placeholder="مثال: ميدان التحرير - أمام مترو السادات"
                      value={formData.meetingPoint}
                      onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                      className="text-right rounded-xl h-10"
                    />
                    <p className="text-xs text-muted-foreground">المكان الذي ستلتقي فيه بالمتدربين</p>
                  </div>

                  <Label className="text-sm text-primary font-medium mt-4">مستندات الكابتن *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <DocumentUploadField
                      id="carLicenseInput"
                      label="رخصة السيارة"
                      icon={FileText}
                      preview={carLicensePreview}
                      type="car_license"
                    />
                    <DocumentUploadField
                      id="drivingLicenseInput"
                      label="الرخصة الشخصية"
                      icon={FileText}
                      preview={drivingLicensePreview}
                      type="driving_license"
                    />
                    <DocumentUploadField
                      id="carPhotoInput"
                      label="صورة العربية"
                      icon={Camera}
                      preview={carPhotoPreview}
                      type="car_photo"
                    />
                  </div>

                  {/* Optional Extra Cars */}
                  <div className="space-y-3 mt-4">
                    <Label className="text-sm text-muted-foreground font-medium">إضافة سيارة أخرى (اختياري)</Label>
                    
                    {extraCars.map((car, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-xl bg-secondary/30">
                        <Car className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-medium flex-1">{car.car_type}</span>
                        <span className="text-xs text-muted-foreground">
                          {car.transmission_type === "manual" ? "مانيوال" : "أوتوماتيك"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExtraCars(extraCars.filter((_, i) => i !== index))}
                          className="text-destructive hover:text-destructive/80 text-xs"
                        >
                          حذف
                        </button>
                      </div>
                    ))}

                    {showExtraCarForm ? (
                      <div className="p-3 border border-dashed border-primary/40 rounded-xl bg-primary/5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="نوع السيارة"
                            value={newExtraCar.car_type}
                            onChange={(e) => setNewExtraCar({ ...newExtraCar, car_type: e.target.value })}
                            className="text-right rounded-xl h-10 text-sm"
                          />
                          <Select
                            value={newExtraCar.transmission_type}
                            onValueChange={(value) => setNewExtraCar({ ...newExtraCar, transmission_type: value })}
                          >
                            <SelectTrigger className="text-right rounded-xl h-10 text-sm">
                              <SelectValue placeholder="ناقل الحركة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">مانيوال</SelectItem>
                              <SelectItem value="automatic">أوتوماتيك</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            className="text-xs rounded-xl"
                            onClick={() => {
                              if (newExtraCar.car_type.trim() && newExtraCar.transmission_type) {
                                setExtraCars([...extraCars, { ...newExtraCar }]);
                                setNewExtraCar({ car_type: "", transmission_type: "" });
                                setShowExtraCarForm(false);
                              } else {
                                toast.error("يرجى ملء بيانات السيارة");
                              }
                            }}
                          >
                            إضافة
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-xs rounded-xl"
                            onClick={() => {
                              setShowExtraCarForm(false);
                              setNewExtraCar({ car_type: "", transmission_type: "" });
                            }}
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowExtraCarForm(true)}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        إضافة سيارة أخرى
                      </button>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-primary hover:underline"
              >
                {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب بالفعل؟ سجل دخول"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
