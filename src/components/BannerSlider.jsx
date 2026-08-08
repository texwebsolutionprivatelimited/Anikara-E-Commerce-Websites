import React, { useRef, useState } from "react";
import { ArrowRight, Truck, RotateCcw, Sparkles, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css?import";
import "swiper/css/pagination?import";
import "swiper/css/effect-fade?import";

// Custom Nav Button
function NavButton({ direction, onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  const isPrev = direction === "prev";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        [isPrev ? "left" : "right"]: "20px",
        width: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
        padding: 0,
        outline: "none",
        background: "none",
      }}
    >
      {/* Outer ring */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: hovered ? "2px solid #FF4D6D" : "2px solid rgba(17,17,17,0.15)",
          transition: "border-color 0.3s ease, transform 0.3s ease",
          transform: hovered ? "scale(1.12)" : "scale(1)",
        }}
      />
      {/* Glass fill */}
      <span
        style={{
          position: "absolute",
          inset: "4px",
          borderRadius: "50%",
          background: hovered
            ? "linear-gradient(135deg, #FF4D6D 0%, #ff1e46 100%)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: hovered
            ? "0 8px 32px rgba(255,77,109,0.35), 0 2px 8px rgba(0,0,0,0.10)"
            : "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.07)",
          transition: "all 0.3s ease",
        }}
      />
      {/* Arrow icon — custom SVG chevron */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{
          position: "relative",
          zIndex: 1,
          transform: `translateX(${hovered ? (isPrev ? "-1px" : "1px") : "0px"})`,
          transition: "transform 0.3s ease",
        }}
      >
        {isPrev ? (
          <path
            d="M10 3L5 8L10 13"
            stroke={hovered ? "#fff" : "#111111"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3L11 8L6 13"
            stroke={hovered ? "#fff" : "#111111"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export default function BannerSlider({ slides, navigate }) {
  const swiperRef = useRef(null);

  return (
    <section className="w-full bg-white pt-2 sm:pt-3 pb-1 sm:pb-2">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative w-full h-[180px] min-[360px]:h-[200px] min-[400px]:h-[220px] sm:h-auto banner-aspect-ratio overflow-hidden rounded-xl sm:rounded-2xl shadow-sm">
          
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={slides.length > 1}
            className="w-full h-full"
          >
            {slides.map((slide) => {
              const isFullWidth = !!slide.isFullWidth;
              return (
                <SwiperSlide
                  key={slide.id}
                  className={`relative w-full h-full bg-white ${isFullWidth ? "cursor-pointer" : ""}`}
                  onClick={isFullWidth ? () => navigate(slide.navigatePage, slide.navigateParams) : undefined}
                >
                  {isFullWidth ? (
                    <>
                      {/* Full-width Banner Image */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {/* Desktop/Laptop (lg and up) */}
                        <div
                          className="hidden lg:block w-full h-full bg-cover bg-top"
                          style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        {/* Mobile/Tablet (below lg) */}
                        <div
                          className="block lg:hidden w-full h-full bg-cover bg-top"
                          style={{ backgroundImage: `url(${slide.mobileImage || slide.image})` }}
                        />
                        {/* Subtle bottom gradient overlay for clear CTA contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Screen reader accessibility content */}
                      <span className="sr-only">
                        {slide.subtitle} - {slide.title} - {slide.desc}
                      </span>
                    </>
                  ) : (
                    <>
                      {/* Background Image */}
                      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] overflow-hidden">
                        {/* Desktop/Laptop (lg and up) */}
                        <div
                          className="hidden lg:block w-full h-full bg-cover bg-top"
                          style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        {/* Mobile/Tablet (below lg) */}
                        <div
                          className="block lg:hidden w-full h-full bg-cover bg-top"
                          style={{ backgroundImage: `url(${slide.mobileImage || slide.image})` }}
                        />
                        {/* Mobile/Tablet: strong overlay so text is readable */}
                        <div className="lg:hidden absolute inset-0 bg-white/75 z-10" />
                        {/* Desktop/Laptop: soft left fade */}
                        <div className="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                      </div>

                      {/* Slide Content */}
                      <div className="absolute inset-0 flex items-center z-20">
                        <div className="w-full px-5 sm:px-8 lg:px-16 max-w-7xl mx-auto">
                          <div className="max-w-[85%] sm:max-w-[55%] md:max-w-lg text-[#111111] space-y-2 sm:space-y-3 md:space-y-4">
                            <span className="text-[9.5px] sm:text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#FF4D6D] uppercase font-display block">
                              {slide.subtitle}
                            </span>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-[#111111] font-display">
                              {slide.title}
                            </h1>
                            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-600 font-light leading-relaxed hidden sm:block font-sans max-w-xs md:max-w-sm">
                              {slide.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Buttons — hidden on mobile */}
          <div className="hidden sm:block">
            <NavButton
              direction="prev"
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <NavButton
              direction="next"
              onClick={() => swiperRef.current?.slideNext()}
            />
          </div>
        </div>

        {/* Responsive Luxury Feature & Trust Bar below Hero Banner */}
        <div className="mt-3.5 sm:mt-5 px-0.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            
            {/* Feature 1: Free Shipping */}
            <div className="group relative flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-neutral-50/90 via-white to-neutral-50/90 border border-neutral-200/80 hover:border-[#FF4D6D]/30 hover:bg-white shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(255,77,109,0.08)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#FF4D6D] group-hover:text-white transition-all duration-300">
                <Truck size={14} className="sm:w-4 sm:h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11.5px] sm:text-xs lg:text-[13px] font-bold text-neutral-900 tracking-wide font-sans group-hover:text-[#FF4D6D] transition-colors leading-tight">
                  Free Shipping
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-normal hidden lg:block leading-tight mt-0.5">
                  On all orders over ₹1,500
                </span>
              </div>
            </div>

            {/* Feature 2: Easy Returns */}
            <div className="group relative flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-neutral-50/90 via-white to-neutral-50/90 border border-neutral-200/80 hover:border-[#FF4D6D]/30 hover:bg-white shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(255,77,109,0.08)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#FF4D6D] group-hover:text-white transition-all duration-300">
                <RotateCcw size={14} className="sm:w-4 sm:h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11.5px] sm:text-xs lg:text-[13px] font-bold text-neutral-900 tracking-wide font-sans group-hover:text-[#FF4D6D] transition-colors leading-tight">
                  Easy Returns
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-normal hidden lg:block leading-tight mt-0.5">
                  15-Day hassle-free exchange
                </span>
              </div>
            </div>

            {/* Feature 3: Premium Fabrics */}
            <div className="group relative flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-neutral-50/90 via-white to-neutral-50/90 border border-neutral-200/80 hover:border-[#FF4D6D]/30 hover:bg-white shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(255,77,109,0.08)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#FF4D6D] group-hover:text-white transition-all duration-300">
                <Sparkles size={14} className="sm:w-4 sm:h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11.5px] sm:text-xs lg:text-[13px] font-bold text-neutral-900 tracking-wide font-sans group-hover:text-[#FF4D6D] transition-colors leading-tight">
                  Premium Fabrics
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-normal hidden lg:block leading-tight mt-0.5">
                  100% Handcrafted quality
                </span>
              </div>
            </div>

            {/* Feature 4: 4.9 Rating */}
            <div className="group relative flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-neutral-50/90 via-white to-neutral-50/90 border border-neutral-200/80 hover:border-amber-400/40 hover:bg-white shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.12)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Star size={14} className="sm:w-4 sm:h-4 fill-amber-400 text-amber-500 group-hover:fill-white group-hover:text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11.5px] sm:text-xs lg:text-[13px] font-bold text-neutral-900 tracking-wide font-sans group-hover:text-amber-600 transition-colors leading-tight">
                  4.9 Rating
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-normal hidden lg:block leading-tight mt-0.5">
                  From 10,000+ happy buyers
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
