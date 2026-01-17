import captainDinaImage from "@/assets/captain-dina.jpg";
const AboutSection = () => {
  return <section id="about" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative flex justify-center">
            {/* Question Mark */}
            <div className="absolute right-0 top-0 text-primary text-[200px] font-bold opacity-20 leading-none hidden lg:block">
              ؟
            </div>
            
            {/* Image Container */}
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-primary overflow-hidden shadow-glow">
                <img src={captainDinaImage} alt="كابتن دينا أحمد - مدربة قيادة" className="w-full h-full object-cover object-top" />
              </div>
              
              {/* Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold text-sm shadow-lg">
                DRIVING INSTRUCTOR
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="text-center lg:text-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ليه تختاري تتعلمي السواقة مع كابتن دينا؟
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              مع خبرة أكتر من 15 سنة في مجال تعليم القيادة، كابتن دينا أحمد بتقدم تجربة تعليمية فريدة تجمع بين الاحترافية والتأهيل النفسي للتخلص من الخوف.
            </p>

            <ul className="space-y-3 text-right">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>تدريب على القيادة الدفاعية والآمنة</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>مدربين ومدربات محترفين</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>التأهيل النفسي للتخلص من الخوف</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>تأهيل لاختبار الرخصة والمساعدة في استخراجها</span>
              </li>
            </ul>

            
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;