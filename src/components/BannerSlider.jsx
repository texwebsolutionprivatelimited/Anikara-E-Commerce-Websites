import React from "react";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function BannerSlider({ slides, navigate }) {
  return (
    <section className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] lg:h-[480px] overflow-hidden bg-white border-b border-neutral-100">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full bg-white">
            {/* Background Image (Absolute on mobile, right-aligned on desktop) */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[55%] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-10000 scale-102"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Gradient edge for blending into white bg on desktop */}
              <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
              {/* Soft overlay on mobile to keep dark text readable */}
              <div className="md:hidden absolute inset-0 bg-white/80 z-10" />
            </div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-md md:max-w-lg text-[#111111] space-y-3 sm:space-y-4">
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#FF4D6D] uppercase font-display block">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#111111] font-display">
                    {slide.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-sm hidden sm:block font-sans">
                    {slide.desc}
                  </p>
                  <div className="pt-2 sm:pt-4">
                    <button
                      onClick={() => navigate(slide.navigatePage, slide.navigateParams)}
                      className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#FF4D6D] hover:text-white text-white text-xs font-bold tracking-widest uppercase px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 shadow-md cursor-pointer focus:outline-none font-sans"
                    >
                      Shop Now
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
