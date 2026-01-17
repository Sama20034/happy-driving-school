import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { FileText, AlertCircle } from "lucide-react";

const Terms = () => {
  const terms = [
    "التزام كل من المدربة والمتدربة بمواعيد الحصص المتفق عليها حسب آخر إتصال وفي حالة تغيب المتدربة أو إلغاء المفاجئ فلا يحق لها المطالبة بتعويض الحصة ويحق للعميل طلب تغير المدرب في حاله عدم الراحه.",
    "الوقت الضائع في انتظار العميلة يتم حسابه من وقت الحصة ولا يتم التعويض عنه.",
    "قيمة الكورس تدفع كاملة في اليوم الأول للتدريب وقبل بداية الحصة الأولى.",
    "في حالة انقطاع المتدربة عن التدريب بدون علم الإدارة لا يجوز للمطالبة بتعويض الحصص المتبقية أو استرداد المبلغ.",
    "يقدم الإداريات بأي مشكلات أو ملاحظات فور حدوثها (كوني إيجابية).",
    "في حالة إعتذار أو تأجيل المدرب للكورس لأكثر من مرة يجب إبلاغ الإدارة بشكل فوري للتدخل.",
    "يؤكد من وجود تاريخ ووقت بدء وانتهاء الكورس بشكل دقيق وواضح ورضاكِ التام عن ذلك.",
    "الكورس يبدأ وينتهي في مده حد أقصى 30 يوماً للكورس ولا يجوز تجاوز المدة المحددة من قبل المدربة أو المتدربة والا بإذن الإدارة.",
    "يجب على المتدربة اتباع تعليمات الكابتن."
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              الشروط والأحكام
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              يرجى قراءة الشروط والأحكام التالية بعناية قبل الحجز
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  هام جداً - شروط متفق عليها بين العميل والإدارة
                </h2>
                <p className="text-muted-foreground">
                  بحجزك لأي كورس فإنك توافق على جميع الشروط والأحكام المذكورة أدناه
                </p>
              </div>
            </div>
          </div>

          {/* Terms List */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <ul className="space-y-6">
                {terms.map((term, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-foreground leading-relaxed pt-1">
                      {term}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-8">
              <p className="text-muted-foreground text-sm">
                في حالة وجود أي استفسارات، يرجى التواصل معنا عبر واتساب
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;
