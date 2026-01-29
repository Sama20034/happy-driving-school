import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { FileText, AlertCircle } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      title: "أولاً: الالتزام بالمواعيد",
      terms: [
        "يلتزم العميل بالحضور في الموعد المحدد للحصة التدريبية.",
        "في حال إلغاء الحصة قبل الموعد بأقل من ساعة واحدة، تُحتسب الحصة كاملة على العميل.",
        "في حال تأخر العميل عن الموعد المحدد، يتم احتساب وقت التأخير من زمن الحصة ولا يتم التعويض عنه."
      ]
    },
    {
      title: "ثانياً: الموافقة على الشروط",
      terms: [
        "بمجرد إتمام الحجز، يُعتبر العميل موافقاً على جميع بنود وشروط هذا العقد.",
        "يُنصح بقراءة جميع الشروط والأحكام بعناية قبل إتمام عملية الحجز."
      ]
    },
    {
      title: "ثالثاً: شروط المرافقين",
      terms: [
        "لا يُسمح باصطحاب الأطفال أثناء الحصص التدريبية حفاظاً على سلامة الجميع.",
        "يُشترط ألا يقل عمر أي مرافق عن 18 سنة."
      ]
    },
    {
      title: "رابعاً: مسؤوليات المدرب",
      terms: [
        "المدرب هو المسؤول عن تحديد نقطة بداية ونهاية كل حصة تدريبية.",
        "يحق للعميل طلب تغيير المدرب في حالة عدم الراحة أو وجود مشكلة.",
        "في حالة اعتذار أو تأجيل المدرب للحصة لأكثر من مرة، يجب إبلاغ الإدارة فوراً للتدخل."
      ]
    },
    {
      title: "خامساً: سياسة الإلغاء والتأجيل",
      terms: [
        "لا يُسمح بإلغاء الكورس بعد بدء التدريب العملي.",
        "يمكن تأجيل الحصة قبل الموعد بما لا يقل عن 6 ساعات.",
        "التأجيل قبل الموعد بأقل من ساعتين يُقبل فقط في حالات العذر القهري.",
        "في حال تأجيل الكورس من جهة العميل، يكون الحد الأقصى للتأجيل 3 أشهر، وبعدها يُلغى التعاقد دون استرداد باقي المبلغ."
      ]
    },
    {
      title: "سادساً: تفاصيل الحصة التدريبية",
      terms: [
        "مدة الحصة التدريبية تتراوح بين 45 إلى 60 دقيقة حسب نوع الكورس.",
        "المسافة المقطوعة في الحصة الواحدة لا تقل عن 10 كيلومترات ولا تزيد عن 25 كيلومتراً.",
        "سعر الساعة التدريبية يتراوح بين 300 و500 جنيه حسب نوع السيارة والمنطقة."
      ]
    },
    {
      title: "سابعاً: الدفع والسداد",
      terms: [
        "قيمة الكورس تُدفع كاملة في اليوم الأول للتدريب وقبل بداية الحصة الأولى.",
        "في حالة انقطاع المتدرب عن التدريب دون إبلاغ الإدارة، لا يحق المطالبة باسترداد المبلغ أو تعويض الحصص المتبقية."
      ]
    },
    {
      title: "ثامناً: أحكام عامة",
      terms: [
        "يجب على المتدرب اتباع تعليمات المدرب أثناء الحصة التدريبية.",
        "يُرجى إبلاغ الإدارة بأي مشكلات أو ملاحظات فور حدوثها.",
        "يتم التأكد من وجود تاريخ ووقت بدء وانتهاء الكورس بشكل دقيق وواضح.",
        "مدة الكورس الكاملة لا تتجاوز 30 يوماً من تاريخ البدء إلا بإذن مسبق من الإدارة."
      ]
    }
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

          {/* Terms Sections */}
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <h3 className="text-xl font-bold text-primary mb-4 border-b border-border pb-3">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.terms.map((term, termIndex) => (
                    <li key={termIndex} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                        {termIndex + 1}
                      </span>
                      <p className="text-foreground leading-relaxed">
                        {term}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 max-w-4xl mx-auto">
            <p className="text-muted-foreground text-sm">
              في حالة وجود أي استفسارات، يرجى التواصل معنا عبر واتساب
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;
