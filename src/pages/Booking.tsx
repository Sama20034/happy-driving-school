import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BookingStepper from "@/components/booking/BookingStepper";
import CountryStep from "@/components/booking/CountryStep";
import GovernorateStep from "@/components/booking/GovernorateStep";
import BranchStep from "@/components/booking/BranchStep";
import VehicleTypeStep from "@/components/booking/VehicleTypeStep";
import TransmissionStep from "@/components/booking/TransmissionStep";
import CourseStep from "@/components/booking/CourseStep";
import CaptainStep from "@/components/booking/CaptainStep";
import CheckoutStep from "@/components/booking/CheckoutStep";
import { BookingData, initialBookingData, VehicleType } from "@/types/booking";
import { toast } from "sonner";

const steps = ["الدولة", "المحافظة", "الفرع", "نوع المركبة", "نوع القير", "الكورس", "الكابتن", "الدفع"];

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Auto-advance to next step when selection is made
  useEffect(() => {
    const canAdvance = () => {
      switch (currentStep) {
        case 0:
          return !!bookingData.countryId;
        case 1:
          return !!bookingData.governorateId;
        case 2:
          return !!bookingData.branchId;
        case 3:
          return !!bookingData.vehicleType;
        case 4:
          return !!bookingData.transmissionType;
        case 5:
          return !!bookingData.courseId;
        case 6:
          return !!bookingData.captainId;
        default:
          return false;
      }
    };

    if (canAdvance() && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [bookingData, currentStep]);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    toast.success("تم تأكيد الحجز بنجاح! سنتواصل معك قريباً");
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CountryStep
            selectedId={bookingData.countryId}
            onSelect={(id, name) =>
              setBookingData({ 
                ...bookingData, 
                countryId: id, 
                countryName: name, 
                governorateId: "", 
                governorateName: "",
                branchId: "", 
                branchName: "" 
              })
            }
          />
        );
      case 1:
        return (
          <GovernorateStep
            countryId={bookingData.countryId}
            selectedId={bookingData.governorateId}
            onSelect={(id, name) =>
              setBookingData({ ...bookingData, governorateId: id, governorateName: name, branchId: "", branchName: "" })
            }
          />
        );
      case 2:
        return (
          <BranchStep
            governorateId={bookingData.governorateId}
            selectedId={bookingData.branchId}
            onSelect={(id, name) =>
              setBookingData({ ...bookingData, branchId: id, branchName: name, vehicleType: "", transmissionType: "", captainId: "", captainName: "" })
            }
          />
        );
      case 3:
        return (
          <VehicleTypeStep
            selectedType={bookingData.vehicleType}
            onSelect={(type) =>
              setBookingData({ ...bookingData, vehicleType: type, transmissionType: "", courseId: "", courseName: "", coursePrice: 0, courseSessions: 0 })
            }
          />
        );
      case 4:
        return (
          <TransmissionStep
            selectedType={bookingData.transmissionType}
            onSelect={(type) =>
              setBookingData({ ...bookingData, transmissionType: type, courseId: "", courseName: "", coursePrice: 0, courseSessions: 0 })
            }
          />
        );
      case 5:
        return (
          <CourseStep
            governorateId={bookingData.governorateId}
            branchId={bookingData.branchId}
            selectedId={bookingData.courseId}
            onSelect={(id, name, price, sessions) =>
              setBookingData({
                ...bookingData,
                courseId: id,
                courseName: name,
                coursePrice: price,
                courseSessions: sessions,
              })
            }
          />
        );
      case 6:
        return (
          <CaptainStep
            branchId={bookingData.branchId}
            selectedId={bookingData.captainId}
            onSelect={(id, name) =>
              setBookingData({ ...bookingData, captainId: id, captainName: name })
            }
          />
        );
      case 7:
        return (
          <CheckoutStep
            bookingData={bookingData}
            onUpdateCustomer={(name, phone, notes) =>
              setBookingData({ ...bookingData, customerName: name, customerPhone: phone, customerNotes: notes })
            }
            onConfirm={handleConfirm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>احجز كورسك الآن | كابتن مصر لتعليم قيادة السيارات</title>
        <meta name="description" content="احجز كورس تعليم السواقة الآن - اختر المحافظة والفرع والكابتن المناسب لك" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Stepper */}
          <div className="max-w-5xl mx-auto mb-8 overflow-x-auto">
            <BookingStepper currentStep={currentStep} steps={steps} />
          </div>

          {/* Step Content */}
          <div className="max-w-5xl mx-auto">
            {renderStep()}
          </div>

          {/* Back Button Only */}
          {currentStep > 0 && currentStep < 7 && (
            <div className="max-w-5xl mx-auto mt-8 flex items-center justify-end">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowRight size={18} />
                السابق
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Booking;
