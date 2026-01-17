import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CoursesSection from "@/components/home/CoursesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>دينا أحمد - Defensive Driving | أكاديمية تعليم السواقة</title>
        <meta
          name="description"
          content="أكاديمية دينا أحمد لتعليم السواقة - كباتن محترفين، سيارات حديثة، تدريب عملي مكثف. احجز كورسك الآن!"
        />
      </Helmet>

      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <WhyUsSection />
        <CoursesSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
