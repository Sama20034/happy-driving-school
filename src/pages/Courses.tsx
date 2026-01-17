import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const courses = [
  {
    id: 1,
    title: "كورس تمهيدي",
    sessions: 4,
    description: "للمبتدئين الجدد - تعلم أساسيات القيادة",
    popular: false,
  },
  {
    id: 2,
    title: "كورس ممارسة",
    sessions: 6,
    description: "لمن لديه خبرة سابقة - تحسين المهارات",
    popular: true,
  },
  {
    id: 3,
    title: "كورس المبتدئين",
    sessions: 10,
    description: "كورس شامل من الصفر حتى الاحتراف",
    popular: false,
  },
  {
    id: 4,
    title: "حجز بالحصة",
    sessions: 1,
    description: "حصة واحدة للتدريب أو المراجعة",
    popular: false,
  },
];

const Courses = () => {
  return (
    <>
      <Helmet>
        <title>الكورسات المتاحة | أكاديمية كابتن دينا أحمد</title>
        <meta
          name="description"
          content="اختر الكورس المناسب لمستواك - كورس تمهيدي، كورس ممارسة، كورس المبتدئين، أو حجز بالحصة"
        />
      </Helmet>

      <Header />
      <main className="pt-24 pb-20 bg-muted min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">الكورسات المتاحة</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              اختر الكورس المناسب لمستواك وابدأ رحلتك في تعلم السواقة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`relative bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border-2 ${
                  course.popular ? "border-primary" : "border-transparent"
                }`}
              >
                {course.popular && (
                  <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                
                <h2 className="text-xl font-bold mb-3">{course.title}</h2>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                <div className="flex items-center gap-2 text-primary font-bold mb-6">
                  <Clock size={18} />
                  <span>{course.sessions} حصة</span>
                </div>

                <Button
                  className={`w-full ${course.popular ? "gradient-primary text-primary-foreground" : ""}`}
                  variant={course.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/booking">
                    احجز الآن
                    <ArrowLeft className="mr-2" size={16} />
                  </Link>
                </Button>
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

export default Courses;
