import { Helmet } from "react-helmet-async";
import { 
  Shield, 
  Target, 
  Clock, 
  BookOpen, 
  Brain, 
  Car, 
  Route, 
  FileCheck 
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const benefits = [
  {
    icon: Shield,
    title: "القيادة الدفاعية والآمنة",
    description: "قيادة السيارات بطريقة القيادة الدفاعية والقيادة الآمنة مع مدربين ومدربات محترفين",
  },
  {
    icon: Target,
    title: "التعليم بالعلامات",
    description: "التعليم بالعلامات وتحديد أبعاد عربيتك بدقة عالية",
  },
  {
    icon: Clock,
    title: "خبرة أكتر من 15 سنة",
    description: "خبرة أكتر من 15 سنة بالتدريب على قيادة السيارات",
  },
  {
    icon: BookOpen,
    title: "تعليم نظري وعملي",
    description: "هتتعلمي نظري وعملي لفهم كامل لقواعد الطريق",
  },
  {
    icon: Brain,
    title: "التأهيل النفسي",
    description: "التأهيل النفسي للتخلص من الخوف وبناء الثقة بالنفس",
  },
  {
    icon: Car,
    title: "أساسيات وفنيات الركنات",
    description: "هتتعلمي أساسيات وفنيات وركنات عربيتك باحترافية",
  },
  {
    icon: Route,
    title: "طرق متنوعة",
    description: "هتتعلمي في طرق مزدحمة وطرق السفر السريعة",
  },
  {
    icon: FileCheck,
    title: "تأهيل لاختبار الرخصة",
    description: "بنأهلك لاختبار الرخصة وبنساعدك في استخراجها",
  },
];

const WhyUs = () => {
  return (
    <>
      <Helmet>
        <title>لماذا نحن | أكاديمية كابتن دينا أحمد</title>
        <meta
          name="description"
          content="اكتشف لماذا أكاديمية كابتن دينا أحمد هي الخيار الأفضل لتعلم السواقة - خبرة 15 سنة، تأهيل نفسي، قيادة دفاعية"
        />
      </Helmet>

      <Header />
      <main className="pt-24 pb-20 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              ليه تختاري تتعلمي السواقة مع أكاديمية كابتن دينا؟
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              مفهوم جديد في السواقة مع أفضل تجربة تعليم في مصر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 group"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="text-primary-foreground" size={24} />
                </div>
                <h2 className="text-lg font-bold mb-2">{benefit.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default WhyUs;
