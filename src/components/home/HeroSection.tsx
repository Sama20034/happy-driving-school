import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Star, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import HeroSlider from "./HeroSlider";

const useAnimatedCounter = (target: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === prevTarget.current) return;
    const start = prevTarget.current;
    prevTarget.current = target;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
};

const HeroSection = () => {
  const { user } = useAuth();
  const [captainCount, setCaptainCount] = useState(0);
  const [traineeCount, setTraineeCount] = useState(0);
  const [avgRating, setAvgRating] = useState(5.0);

  const animatedCaptains = useAnimatedCounter(captainCount);
  const animatedTrainees = useAnimatedCounter(traineeCount);
  const animatedRating = useAnimatedCounter(Math.round(avgRating * 10), 1000);

  const fetchStats = useCallback(async () => {
    const [c, t, r] = await Promise.all([
      supabase.rpc("get_captains_count"),
      supabase.rpc("get_satisfied_trainees_count"),
      supabase.from("captain_profiles").select("rating").eq("status", "active"),
    ]);
    setCaptainCount(c.data || 0);
    setTraineeCount(t.data || 0);
    const ratings = r.data?.map(x => x.rating).filter(Boolean) || [];
    if (ratings.length) setAvgRating(ratings.reduce((a, b) => a + b, 0) / ratings.length);
  }, []);

  useEffect(() => {
    fetchStats();

    const rolesChannel = supabase
      .channel('hero-roles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, () => fetchStats())
      .subscribe();

    const bookingChannel = supabase
      .channel('hero-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'captain_bookings' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(rolesChannel);
      supabase.removeChannel(bookingChannel);
    };
  }, [fetchStats]);

  return (
    <section className="relative">
      {/* Slider */}
      <HeroSlider />

      {/* Overlay content */}
      <div className="gradient-navy">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-white/15">
              <Sparkles className="w-4 h-4" />
              <span>المنصة الأولى لتدريب القيادة في مصر</span>
              <div className="flex items-center gap-0.5 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-white/80 text-white/80" />
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              {user ? (
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/95 text-base px-8 py-6 rounded-xl font-semibold shadow-xl shadow-black/20 transition-all hover:scale-[1.02]" 
                  asChild
                >
                  <Link to="/captains">
                    احجز الآن
                    <ArrowLeft className="mr-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/95 text-base px-8 py-6 rounded-xl font-semibold shadow-xl shadow-black/20 transition-all hover:scale-[1.02]" 
                    asChild
                  >
                    <Link to="/auth?role=trainee">
                      سجّل الآن كمتدرب
                      <ArrowLeft className="mr-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white/10 border-2 border-white/25 text-white hover:bg-white/20 hover:border-white/40 text-base px-8 py-6 rounded-xl font-medium backdrop-blur-sm transition-all" 
                    asChild
                  >
                    <Link to="/auth?role=captain">
                      سجّل الآن ككابتن
                      <ArrowLeft className="mr-2 w-5 h-5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tabular-nums">+{animatedCaptains}</div>
                  <div className="text-sm text-white/60">كابتن مسجل</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Star className="w-5 h-5 text-white fill-white/30" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tabular-nums">{(animatedRating / 10).toFixed(1)}</div>
                  <div className="text-sm text-white/60">متوسط التقييم</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tabular-nums">+{animatedTrainees}</div>
                  <div className="text-sm text-white/60">متدرب راضي</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
