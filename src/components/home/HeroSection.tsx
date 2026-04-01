import { useNavigate } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import HeroSlider from "./HeroSlider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (user) {
      navigate("/captains");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="w-full">
      <HeroSlider />
      <div className="flex justify-center py-4 md:hidden">
        <Button
          size="lg"
          onClick={handleBookingClick}
          className="text-lg px-10 py-6 rounded-xl shadow-lg gap-3 animate-pulse hover:animate-none"
        >
          <CalendarCheck className="!size-6" />
          احجز الآن
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
