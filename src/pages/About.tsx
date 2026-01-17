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
  ArrowLeft
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
        {/* Hero Section */}
        <section className="py-16 gradient-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                من نحن
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                منصة كباتن القيادة اتأسست لحل مشاكل عدم الثقة والأمان في سوق تدريب القيادة في مصر. 
                هدفنا توفير بيئة آمنة وشفافة تجمع بين المتدربين الجادين والكباتن المحترفين.
              </p>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">المشكلة اللي بنحلها</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                سوق تدريب القيادة في مصر بيواجه تحديات كتير بتأثر على المتدربين والكباتن
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <problem.icon className="text-destructive" size={24} />
                  </div>
                  <h3 className="font-bold mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground text-sm">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">الحل اللي بنقدمه</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                صممنا منصة متكاملة تحل كل المشاكل دي وتوفر تجربة آمنة للجميع
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {solutions.map((solution, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:shadow-card transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <solution.icon className="text-primary-foreground" size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{solution.title}</h3>
                    <p className="text-muted-foreground text-sm">{solution.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">ضمان الأمان</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                أمانك وأمان الكابتن أولوية قصوى عندنا. شوف إزاي بنحمي كل الأطراف
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {safetyFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <feature.icon className="text-accent" size={20} />
                    </div>
                    <h3 className="font-bold">{feature.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 gradient-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">رؤيتنا</h2>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8">
                نسعى لتنظيم سوق تدريب القيادة في مصر بشكل احترافي وآمن، 
                ونكون المنصة الأولى والموثوقة اللي بيلجأ ليها كل اللي عايز يتعلم السواقة 
                أو يشتغل ككابتن تدريب.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8"
                  asChild
                >
                  <Link to="/auth">
                    انضم إلينا
                    <ArrowLeft className="mr-2" size={18} />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8"
                  asChild
                >
                  <a href="tel:01220501299">
                    <Phone className="ml-2" size={18} />
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
