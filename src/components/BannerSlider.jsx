import React, { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
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
    <section className="w-full bg-white pt-2 sm:pt-3 pb-1 sm:pb-2 border-b border-neutral-100">
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
                          className="hidden lg:block w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        {/* Mobile/Tablet (below lg) */}
                        <div
                          className="block lg:hidden w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${slide.mobileImage || slide.image})` }}
                        />
                        {/* Subtle bottom gradient overlay for clear CTA contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Single Primary Minimal CTA Button Overlay (Soft Luxury Neutral Cream Tone, 35px height mobile / 38px desktop, rounded 7px) */}
                      <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-7 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(slide.navigatePage, slide.navigateParams);
                          }}
                          className="group relative inline-flex items-center justify-center gap-1.5 bg-[#FAF4EE] hover:bg-[#F2E6DB] active:scale-[0.98] text-[#2C221E] hover:text-[#191310] text-[11.5px] sm:text-[12.5px] font-semibold tracking-[0.1em] uppercase h-[35px] sm:h-[38px] w-[115px] sm:w-[130px] rounded-[7px] transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer font-sans shrink-0 border border-[#E6D7CB]"
                        >
                          <span className="relative z-10">Shop Now</span>
                          <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 stroke-[2] sm:w-[14px] sm:h-[14px]" />
                        </button>
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
                          className="hidden lg:block w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        {/* Mobile/Tablet (below lg) */}
                        <div
                          className="block lg:hidden w-full h-full bg-cover bg-center"
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
                            <div className="pt-1.5 sm:pt-2 md:pt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(slide.navigatePage, slide.navigateParams);
                                }}
                                className="group relative inline-flex items-center justify-center gap-1.5 bg-[#FAF4EE] hover:bg-[#F2E6DB] active:scale-[0.98] text-[#2C221E] hover:text-[#191310] text-[11.5px] sm:text-[12.5px] font-semibold tracking-[0.1em] uppercase h-[35px] sm:h-[38px] w-[115px] sm:w-[130px] rounded-[7px] transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer focus:outline-none font-sans shrink-0 border border-[#E6D7CB]"
                              >
                                <span className="relative z-10">Shop Now</span>
                                <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 stroke-[2] sm:w-[14px] sm:h-[14px]" />
                              </button>
                            </div>
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

        {/* Horizontally Scrollable Snap Pill List below Hero Banner (Generous Vertical Spacing mt-4 sm:mt-6) */}
        <div className="flex items-center gap-2.5 mt-4 sm:mt-6 px-1 overflow-x-auto scrollbar-hide py-1.5 snap-x snap-mandatory">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/90 text-[10.5px] font-bold text-neutral-800 shrink-0 snap-start shadow-xs">
            <span className="text-[#FF4D6D]">✓</span>
            <span className="font-sans">Free Shipping</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/90 text-[10.5px] font-bold text-neutral-800 shrink-0 snap-start shadow-xs">
            <span className="text-[#FF4D6D]">✓</span>
            <span className="font-sans">Easy Returns</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/90 text-[10.5px] font-bold text-neutral-800 shrink-0 snap-start shadow-xs">
            <span className="text-[#FF4D6D]">✓</span>
            <span className="font-sans">Premium Fabrics</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/90 text-[10.5px] font-bold text-neutral-800 shrink-0 snap-start shadow-xs">
            <span className="text-amber-500">★</span>
            <span className="font-sans">4.9 Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
