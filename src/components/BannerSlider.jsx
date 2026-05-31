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
    <section className="relative w-full h-[190px] xs:h-[220px] sm:h-[290px] md:h-[340px] lg:h-[390px] xl:h-[420px] overflow-hidden bg-white border-b border-neutral-100">
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
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                  </div>
                  {/* Screen reader accessibility content */}
                  <span className="sr-only">
                    {slide.subtitle} - {slide.title} - {slide.desc}
                  </span>
                </>
              ) : (
                <>
                  {/* Background Image */}
                  <div className="absolute inset-y-0 right-0 w-full md:w-[58%] overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    {/* Mobile: strong overlay so text is readable */}
                    <div className="md:hidden absolute inset-0 bg-white/75 z-10" />
                    {/* Desktop: soft left fade */}
                    <div className="hidden md:block absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                  </div>

                  {/* Slide Content */}
                  <div className="absolute inset-0 flex items-center z-20">
                    <div className="w-full px-5 sm:px-8 lg:px-16 max-w-7xl mx-auto">
                      <div className="max-w-[85%] sm:max-w-[55%] md:max-w-lg text-[#111111] space-y-2 sm:space-y-3 md:space-y-4">
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#FF4D6D] uppercase font-display block">
                          {slide.subtitle}
                        </span>
                        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-[#111111] font-display">
                          {slide.title}
                        </h1>
                        <p className="text-[10px] sm:text-xs md:text-sm text-neutral-600 font-light leading-relaxed hidden sm:block font-sans max-w-xs md:max-w-sm">
                          {slide.desc}
                        </p>
                        <div className="pt-1 sm:pt-2 md:pt-4">
                          <button
                            onClick={() => navigate(slide.navigatePage, slide.navigateParams)}
                            className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#111111] hover:bg-[#FF4D6D] hover:text-white text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 transition-all duration-300 shadow-md cursor-pointer focus:outline-none font-sans"
                          >
                            Shop Now
                            <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
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
    </section>
  );
}
