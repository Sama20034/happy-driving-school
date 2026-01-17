import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Target, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  UserCheck, 
  Lock, 
  FileCheck,
  Scale,
  Phone,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const problems = [
  {
    icon: AlertTriangle,
    title: "صعوبة إيجاد كابتن موثوق",
    description: "المتدربين بيعانوا من صعوبة التأكد من مصداقية وكفاءة الكباتن"
  },
  {
    icon: Eye,
    title: "عدم وضوح الأسعار",
    description: "غياب الشفافية في الأسعار وعدم معرفة التكلفة الحقيقية مسبقاً"
  },
  {
    icon: Shield,
    title: "غياب الأمان للطرفين",
    description: "عدم وجود ضمانات تحمي حقوق المتدرب والكابتن في حالة أي مشكلة"
  }
];

const solutions = [
  {
    icon: Users,
    title: "نظام تقييمات شفاف",
    description: "تقييمات حقيقية من متدربين سابقين تساعدك تختار الكابتن المناسب"
  },
  {
    icon: UserCheck,
    title: "بروفايل كامل للكابتن",
    description: "شوف كل تفاصيل الكابتن: الخبرة، نوع العربية، ناقل الحركة، والموقع"
  },
  {
    icon: Lock,
    title: "حجز بدفع ديبوزيت",
    description: "نظام دفع آمن بديبوزيت بسيط يضمن جدية الحجز لكل الأطراف"
  },
  {
    icon: FileCheck,
    title: "توثيق البيانات",
    description: "كل المتدربين والكباتن موثقين ببياناتهم الحقيقية لضمان الأمان"
  }
];

const safetyFeatures = [
  {
    title: "كيف نحمي المتدرب",
    icon: Shield,
    items: [
      "التحقق من هوية الكابتن وبياناته",
      "نظام تقييمات شفاف من متدربين سابقين",
      "إمكانية الإبلاغ عن أي سلوك غير لائق",
      "استرداد الديبوزيت في حالة إلغاء الكابتن"
    ]
  },
  {
    title: "كيف نضمن حق الكابتن",
    icon: UserCheck,
    items: [
      "التحقق من بيانات المتدرب",
      "ديبوزيت يضمن جدية الحجز",
      "حماية من الإلغاء المفاجئ",
      "نظام تقييم عادل للمتدربين"
    ]
  },
  {
    title: "كيف نتعامل مع المشاكل",
    icon: Scale,
    items: [
      "فريق دعم متخصص للتحقيق في الشكاوى",
      "إجراءات واضحة للتعامل مع أي تعدي",
      "حظر الحسابات المخالفة",
      "ضمان استرداد الحقوق لكل الأطراف"
    ]
  }
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>من نحن | كباتن القيادة</title>
        <meta
          name="description"
          content="تعرف على منصة كباتن القيادة - الحل الآمن والموثوق لحجز كباتن تدريب القيادة في مصر"
        />
      </Helmet>

      <Header />
      
      <main className="pt-20">
        {/* Hero Section - Creative Design */}
        <section className="relative py-24 overflow-hidden bg-primary">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-background/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-background/5 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-background/10 rounded-full animate-float" />
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-background/10 rounded-full animate-float-slow" />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--background)) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-background/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">منصة موثوقة ومعتمدة</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                نغير مفهوم تعليم القيادة
                <br />
                <span className="text-background/80">في مصر</span>
              </h1>
              <p className="text-lg md:text-xl text-background/80 leading-relaxed max-w-2xl mx-auto">
                منصة كباتن القيادة اتأسست لحل مشاكل عدم الثقة والأمان في سوق تدريب القيادة. 
                هدفنا توفير بيئة آمنة وشفافة تجمع بين المتدربين الجادين والكباتن المحترفين.
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

        {/* Problem Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-destructive/10 text-destructive px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                التحديات
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">المشكلة اللي بنحلها</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                سوق تدريب القيادة في مصر بيواجه تحديات كتير بتأثر على المتدربين والكباتن
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className="group relative bg-background border-2 border-destructive/20 rounded-3xl p-8 text-center hover:border-destructive/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center border-4 border-background group-hover:bg-destructive/20 transition-colors">
                      <problem.icon className="text-destructive" size={24} />
                    </div>
                  </div>
                  <div className="pt-6">
                    <h3 className="font-bold text-lg mb-3">{problem.title}</h3>
                    <p className="text-muted-foreground">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 bg-secondary/40 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14">
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                الحلول
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">الحل اللي بنقدمه</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                صممنا منصة متكاملة تحل كل المشاكل دي وتوفر تجربة آمنة للجميع
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {solutions.map((solution, index) => (
                <div 
                  key={index}
                  className="group bg-card border border-border rounded-3xl p-6 flex items-start gap-5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <solution.icon className="text-primary-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{solution.title}</h3>
                    <p className="text-muted-foreground">{solution.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                الحماية
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">ضمان الأمان</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                أمانك وأمان الكابتن أولوية قصوى عندنا. شوف إزاي بنحمي كل الأطراف
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {safetyFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <feature.icon className="text-accent" size={24} />
                    </div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-accent" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section - Creative Design */}
        <section className="relative py-24 overflow-hidden bg-primary">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-background/5 rounded-full -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-background/5 rounded-full translate-x-1/2" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <div className="w-20 h-20 rounded-3xl bg-background/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-background/20">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">رؤيتنا للمستقبل</h2>
              <p className="text-xl md:text-2xl text-background/80 leading-relaxed mb-12 max-w-3xl mx-auto">
                نسعى لتنظيم سوق تدريب القيادة في مصر بشكل احترافي وآمن، 
                ونكون المنصة الأولى والموثوقة اللي بيلجأ ليها كل اللي عايز يتعلم السواقة 
                أو يشتغل ككابتن تدريب.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/95 rounded-full px-10 py-6 text-lg font-semibold shadow-xl shadow-black/20"
                  asChild
                >
                  <Link to="/auth">
                    انضم إلينا
                    <ArrowLeft className="mr-2" size={20} />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-full px-10 py-6 text-lg backdrop-blur-sm"
                  asChild
                >
                  <a href="tel:01220501299">
                    <Phone className="ml-2" size={20} />
                    تواصل معنا
                  </a>
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

export default About;
