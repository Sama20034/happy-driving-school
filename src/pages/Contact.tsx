import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "اتصل بنا",
      value: "0121 111 9095",
      href: "tel:01211119095",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageCircle,
      title: "واتساب",
      value: "0122 050 1299",
      href: "https://wa.me/201220501299",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: MapPin,
      title: "الموقع",
      value: "مصر - القاهرة والجيزة",
      href: "#",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "24/7 على مدار الساعة",
      href: "#",
      color: "from-orange-500 to-red-600",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/captinmisr_co?igsh=MThvdHo3Z2cxN3BtZg==",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      gradient: "from-purple-500 via-pink-500 to-orange-500",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61586935952348",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      gradient: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                تواصل معنا
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نحن هنا لمساعدتك في رحلتك لتعلم القيادة. تواصل معنا عبر أي من الطرق التالية وسنرد عليك في أقرب وقت.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <CardContent className="p-6 text-center relative">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <method.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                      <p className="text-muted-foreground" dir="ltr">{method.value}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">تابعنا على السوشيال ميديا</h2>
              <p className="text-muted-foreground">ابقَ على اطلاع بآخر الأخبار والعروض</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${social.gradient} p-[3px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105`}>
                    <div className="w-full h-full rounded-3xl bg-card flex flex-col items-center justify-center gap-2 group-hover:bg-transparent transition-colors duration-300">
                      <div className="text-foreground group-hover:text-white transition-colors duration-300">
                        {social.icon}
                      </div>
                      <span className="font-medium text-sm group-hover:text-white transition-colors duration-300">
                        {social.name}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Info Side */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">أرسل لنا رسالة</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      لديك سؤال أو استفسار؟ املأ النموذج وسنتواصل معك في أقرب وقت ممكن.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">اتصل بنا</p>
                        <p className="font-semibold" dir="ltr">0121 111 9095</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">واتساب</p>
                        <p className="font-semibold" dir="ltr">0122 050 1299</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <Card className="border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">الاسم الكامل</label>
                        <Input placeholder="أدخل اسمك" className="h-12" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">رقم الهاتف</label>
                        <Input placeholder="أدخل رقم هاتفك" type="tel" className="h-12" dir="ltr" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">رسالتك</label>
                        <Textarea placeholder="اكتب رسالتك هنا..." className="min-h-[120px] resize-none" />
                      </div>
                      
                      <Button className="w-full h-12 text-base gap-2">
                        <Send className="w-5 h-5" />
                        إرسال الرسالة
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section Placeholder */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">موقعنا</h2>
              <p className="text-muted-foreground">نعمل في القاهرة والجيزة</p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/20 to-accent/20 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-xl font-semibold">مصر - القاهرة والجيزة</p>
                <p className="text-muted-foreground mt-2">نغطي جميع مناطق القاهرة الكبرى</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
