import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Star, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
      supabase.removeChannel(captainChannel);
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(profileChannel);
    };
  }, [fetchStats]);
  return (
    <section className="min-h-[92vh] gradient-navy flex items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute top-20 right-[5%] w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-3xl" />
        
        {/* Floating shapes */}
        <div className="absolute top-[20%] right-[15%] w-20 h-20 border border-white/10 rounded-2xl rotate-12 animate-float" />
        <div className="absolute top-[40%] left-[10%] w-16 h-16 border border-white/10 rounded-full animate-float-slow" />
        <div className="absolute bottom-[30%] right-[20%] w-12 h-12 bg-white/5 rounded-xl -rotate-12 animate-float" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(228,52%,20%)_100%)]" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/15 animate-fade-up"
          >
            <Sparkles className="w-4 h-4" />
            <span>المنصة الأولى لتدريب القيادة في مصر</span>
            <div className="flex items-center gap-0.5 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-white/80 text-white/80" />
              ))}
            </div>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            ابدأ رحلتك في
            <br />
            <span className="text-white/90">تعلّم القيادة</span>
          </h1>
          
          {/* Description */}
          <p 
            className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            احجز كابتن تدريب موثوق بالقرب منك، شوف التقييمات ونوع العربية، وابدأ التدريب بأمان
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            {user ? (
              // Show "Book Now" button when logged in
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
              // Show registration buttons when not logged in
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
          <div 
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
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
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 36C840 40 960 48 1080 52C1200 56 1320 56 1380 56L1440 56V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;