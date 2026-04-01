import { useNavigate } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import HeroSlider from "./HeroSlider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="w-full relative">
      <HeroSlider />
      {user && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex justify-center md:hidden">
          <Button
            size="lg"
            onClick={() => navigate("/captains")}
            className="text-lg px-10 py-6 rounded-xl shadow-lg gap-3 animate-pulse hover:animate-none"
          >
            <CalendarCheck className="!size-6" />
            احجز الآن
          </Button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
