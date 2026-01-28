import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PaymentMethodsSection from "@/components/home/PaymentMethodsSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>كابتن مصر | لتعليم قيادة السيارات</title>
        <meta
          name="description"
          content="كابتن مصر لتعليم قيادة السيارات - احجز كابتن تدريب قيادة موثوق بالقرب منك."
        />
      </Helmet>

      <Header />
      <main>
        <HeroSection />
        <WhyUsSection />
        <HowItWorksSection />
        <PaymentMethodsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
