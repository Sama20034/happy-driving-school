import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  UserPlus, 
  Car, 
  BookOpen, 
  MapPin, 
  Scale, 
  CreditCard, 
  MessageCircle,
  FileCheck,
  Upload,
  Navigation,
  DollarSign,
  Shield,
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  Award,
  Ban,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Cog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const traineeServices = [
  { icon: UserPlus, title: "إنشاء حساب متدرب", description: "سجّل حساب مجاني في دقائق وابدأ رحلة تعلم القيادة" },
  { icon: Car, title: "اختيار نوع التدريب", description: "اختار بين مانيوال أو أوتوماتيك حسب تفضيلك" },
  { icon: BookOpen, title: "التدريب بالحصة أو الكورس", description: "احجز حصص فردية أو كورس كامل بخصم خاص" },
  { icon: MapPin, title: "الكباتن القريبين", description: "استعرض الكباتن المتاحين بالقرب من موقعك" },
  { icon: Scale, title: "مقارنة الأسعار والتقييمات", description: "قارن بين الكباتن واختار الأنسب ليك" },
  { icon: Car, title: "معرفة نوع العربية", description: "شوف نوع العربية وموديلها قبل ما تحجز" },
  { icon: CreditCard, title: "دفع ديبوزيت آمن", description: "ادفع ديبوزيت الحجز بطرق دفع آمنة ومتعددة" },
  { icon: MessageCircle, title: "التواصل مع الكابتن", description: "تواصل مباشرة مع الكابتن بعد تأكيد الحجز" },
];

const captainServices = [
  { icon: UserPlus, title: "إنشاء حساب كابتن", description: "سجّل كمدرب قيادة وابدأ استقبال الحجوزات" },
  { icon: Upload, title: "رفع المستندات", description: "رخصة السيارة، الرخصة الشخصية، صورة العربية، صورة البطاقة" },
  { icon: MapPin, title: "تحديد مناطق التدريب", description: "حدد المناطق اللي تقدر تدرب فيها" },
  { icon: Navigation, title: "رفع نقطة المقابلة", description: "ارفع لوكيشن نقطة المقابلة للمتدربين" },
  { icon: Car, title: "تفاصيل السيارة", description: "حدد نوع السيارة وناقل الحركة (مانيوال/أوتوماتيك)" },
  { icon: DollarSign, title: "تحديد السعر", description: "حدد سعرك للحصة داخل النطاق (300 - 500 جنيه)" },
  { icon: Shield, title: "حماية مالية", description: "ضمان الديبوزيت في حالة عدم حضور المتدرب" },
];

const dashboardFeatures = [
  { icon: Users, title: "عدد الكباتن", color: "text-primary" },
  { icon: GraduationCap, title: "عدد المتدربين", color: "text-accent" },
  { icon: FileCheck, title: "عدد الطلبات", color: "text-primary" },
  { icon: TrendingUp, title: "الطلبات الناجحة والمرفوضة", color: "text-accent" },
  { icon: BarChart3, title: "الأرباح اليومية", color: "text-primary" },
  { icon: Award, title: "أكثر الكباتن إنتاجية", color: "text-accent" },
  { icon: Ban, title: "الكباتن المحظورين", color: "text-destructive" },
];

const Services = () => {
  return (
    <>
      <Helmet>
        <title>خدماتنا | كباتن القيادة</title>
        <meta
          name="description"
          content="تعرف على خدمات منصة كباتن القيادة للمتدربين والكباتن - حجز تدريب قيادة آمن وموثوق"
        />
      </Helmet>

      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-primary">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-background/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-background/5 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-background/10 rounded-full animate-float" />
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-background/10 rounded-full animate-float-slow" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--background)) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-background/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">خدمات متكاملة</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                خدماتنا
              </h1>
              <p className="text-lg md:text-xl text-background/80 leading-relaxed max-w-2xl mx-auto">
                منصة متكاملة تخدم المتدربين والكباتن بخدمات احترافية وآمنة
              </p>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
            </svg>
          </div>
        </section>

        {/* Trainee Services Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <GraduationCap className="text-primary-foreground" size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">خدمات المتدرب</h2>
            </div>
            <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-14">
              كل اللي تحتاجه لتبدأ رحلة تعلم القيادة بسهولة وأمان
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {traineeServices.map((service, index) => (
                <div 
                  key={index}
                  className="group bg-card rounded-3xl p-6 border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <service.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={26} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 text-lg shadow-xl shadow-primary/20 group"
                asChild
              >
                <Link to="/auth">
                  سجّل كمتدرب
                  <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Captain Services Section */}
        <section className="py-24 bg-secondary/40 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Car className="text-primary-foreground" size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">خدمات الكابتن</h2>
            </div>
            <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-14">
              انضم كمدرب قيادة واستفيد من منصة احترافية لإدارة عملك
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {captainServices.map((service, index) => (
                <div 
                  key={index}
                  className="group bg-card rounded-3xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Number badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                    <service.icon className="text-primary-foreground" size={28} />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-10 py-6 text-lg group"
                asChild
              >
                <Link to="/auth">
                  سجّل ككابتن
                  <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-background/5 rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-background/5 rounded-full" />
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center border border-background/20">
                <LayoutDashboard className="text-primary-foreground" size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">لوحة التحكم</h2>
            </div>
            <p className="text-background/70 text-lg text-center max-w-2xl mx-auto mb-14">
              لوحة تحكم شاملة لإدارة المنصة ومتابعة كل التفاصيل
            </p>

            <div className="max-w-4xl mx-auto">
              <div className="bg-background/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-background/20">
                <div className="flex items-center gap-3 mb-8">
                  <Cog className="text-background/80" size={24} />
                  <span className="text-background/80 font-medium">محتويات لوحة التحكم</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dashboardFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-background/10 rounded-2xl p-5 text-center hover:bg-background/20 transition-colors border border-background/10"
                    >
                      <div className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="text-primary-foreground" size={22} />
                      </div>
                      <span className="text-primary-foreground text-sm font-medium">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                جاهز تبدأ؟
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                سواء كنت متدرب عايز تتعلم أو كابتن عايز تنضم، المنصة جاهزة ليك
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground text-lg px-12 py-7 rounded-full shadow-xl shadow-primary/20 hover:bg-primary/90 group"
                  asChild
                >
                  <Link to="/auth">
                    <GraduationCap className="ml-2" size={22} />
                    سجّل كمتدرب
                  </Link>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 rounded-full border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 group"
                  asChild
                >
                  <Link to="/auth">
                    <Car className="ml-2" size={22} />
                    سجّل ككابتن
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Services;