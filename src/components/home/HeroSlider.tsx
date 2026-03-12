import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";
import heroSlide5 from "@/assets/hero-slide-5.jpg";
import heroSlide6 from "@/assets/hero-slide-6.jpg";

const slides = [heroSlide1, heroSlide2, heroSlide3, heroSlide4, heroSlide5, heroSlide6];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <div className="relative w-full h-[100svh] min-h-[520px] pt-16 overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, direction: "rtl" }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        className="w-full h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="pl-0 h-full">
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={slide}
                  alt={`كابتن مصر - ${i + 1}`}
                  className="h-full w-full object-contain"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current
                ? "bg-primary scale-110 shadow-lg"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`الانتقال للصورة ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
