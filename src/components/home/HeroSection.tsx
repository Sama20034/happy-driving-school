import { useNavigate, Link } from "react-router-dom";
import { CalendarCheck, GraduationCap, Car } from "lucide-react";
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
      <div className="flex flex-col items-center gap-3 py-4 px-4 md:hidden">
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-xl border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 gap-2 h-12"
          >
            <Link to="/auth?role=trainee">
              <GraduationCap className="!size-5" />
              سجّل كمتدرب
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-xl border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 gap-2 h-12"
          >
            <Link to="/auth?role=captain">
              <Car className="!size-5" />
              سجّل كمدرب
            </Link>
          </Button>
        </div>
        <Button
          size="lg"
          onClick={handleBookingClick}
          className="text-lg px-10 py-6 rounded-xl shadow-lg gap-3 animate-pulse hover:animate-none w-full max-w-md"
        >
          <CalendarCheck className="!size-6" />
          احجز الآن
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
