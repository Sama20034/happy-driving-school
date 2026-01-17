import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, Mail, Lock, User, Car, GraduationCap, Upload, CreditCard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'trainee' | 'captain';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('trainee');
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  // Document uploads
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [personalPhotoFile, setPersonalPhotoFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [personalPhotoPreview, setPersonalPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleFileChange = (file: File | null, type: 'id_card' | 'personal_photo') => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'id_card') {
          setIdCardFile(file);
          setIdCardPreview(reader.result as string);
        } else {
          setPersonalPhotoFile(file);
          setPersonalPhotoPreview(reader.result as string);
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
        // Validate required documents
        if (!idCardFile || !personalPhotoFile) {
          toast.error("يرجى رفع صورة البطاقة والصورة الشخصية");
          setIsSubmitting(false);
          return;
        }

        const { error, data } = await signUp(formData.email, formData.password, formData.fullName, selectedRole);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("هذا البريد الإلكتروني مسجل بالفعل");
          } else {
            toast.error(error.message);
          }
        } else if (data?.user) {
          // Upload documents
          const [idCardUrl, personalPhotoUrl] = await Promise.all([
            uploadDocument(idCardFile, data.user.id, 'id_card'),
            uploadDocument(personalPhotoFile, data.user.id, 'personal_photo')
          ]);

          // Update profile with document URLs
          if (idCardUrl && personalPhotoUrl) {
            await supabase
              .from('profiles')
              .update({
                id_card_url: idCardUrl,
                personal_photo_url: personalPhotoUrl
              })
              .eq('user_id', data.user.id);
          }

          toast.success("تم إنشاء الحساب بنجاح! في انتظار موافقة الإدارة");
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

  return (
    <>
      <Helmet>
        <title>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"} | كباتن القيادة</title>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? "أهلاً بك مرة أخرى" : "انضم إلينا الآن"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection - Only show on signup */}
              {!isLogin && (
                <div className="space-y-3">
                  <Label>نوع الحساب</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('trainee')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === 'trainee'
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        selectedRole === 'trainee' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <GraduationCap size={28} />
                      </div>
                      <span className={`font-semibold ${selectedRole === 'trainee' ? 'text-primary' : ''}`}>
                        متدرب
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        عايز أتعلم السواقة
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('captain')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === 'captain'
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        selectedRole === 'captain' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <Car size={28} />
                      </div>
                      <span className={`font-semibold ${selectedRole === 'captain' ? 'text-primary' : ''}`}>
                        كابتن
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        عايز أدرب سواقة
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

              {/* Document Upload - Only show on signup */}
              {!isLogin && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">المستندات المطلوبة *</Label>
                  
                  {/* ID Card Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      صورة البطاقة الشخصية
                    </Label>
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-primary/50 ${
                        idCardPreview ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => document.getElementById('idCardInput')?.click()}
                    >
                      <input
                        id="idCardInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'id_card')}
                      />
                      {idCardPreview ? (
                        <img src={idCardPreview} alt="ID Card" className="max-h-32 mx-auto rounded-lg" />
                      ) : (
                        <div className="py-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">اضغط لرفع صورة البطاقة</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Photo Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <UserCircle className="h-4 w-4" />
                      صورة شخصية
                    </Label>
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-primary/50 ${
                        personalPhotoPreview ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => document.getElementById('personalPhotoInput')?.click()}
                    >
                      <input
                        id="personalPhotoInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'personal_photo')}
                      />
                      {personalPhotoPreview ? (
                        <img src={personalPhotoPreview} alt="Personal Photo" className="max-h-32 mx-auto rounded-lg" />
                      ) : (
                        <div className="py-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">اضغط لرفع صورتك الشخصية</p>
                        </div>
                      )}
                    </div>
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
                  setIdCardFile(null);
                  setPersonalPhotoFile(null);
                  setIdCardPreview(null);
                  setPersonalPhotoPreview(null);
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
