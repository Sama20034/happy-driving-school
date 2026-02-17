import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { useCourses } from "@/hooks/useBookingData";

const Courses = () => {
  const { courses, loading, error } = useCourses();

  return (
    <>
      <Helmet>
        <title>الكورسات المتاحة | كابتن مصر لتعليم قيادة السيارات</title>
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              <p>حدث خطأ في تحميل الكورسات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className={`relative bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border-2 ${
                    index === 1 ? "border-primary" : "border-transparent"
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                      الأكثر طلباً
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary mb-4">
                    <BookOpen size={24} />
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  {course.description && (
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <Clock size={18} />
                    <span>{course.sessions} {course.sessions === 1 ? "حصة" : "حصص"}</span>
                  </div>

                  <div className="mb-6">
                    <span className="text-2xl font-bold text-primary">{course.price}</span>
                    <span className="text-muted-foreground text-sm mr-1">جنيه</span>
                  </div>

                  <Button
                    className={`w-full ${index === 1 ? "gradient-primary text-primary-foreground" : ""}`}
                    variant={index === 1 ? "default" : "outline"}
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
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Courses;
