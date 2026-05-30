import React, { useState, useEffect } from "react";
import { Tag, Copy, Check, ShoppingBag, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

function SingleCoupon({ coupon, navigate, addToast }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true);
      addToast(`Code "${coupon.code}" copied!`, "success");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className={`relative flex items-stretch bg-gradient-to-r ${coupon.bg} border overflow-hidden group cursor-pointer select-none transition-all duration-350 ease-out`}
      style={{
        borderRadius: "8px",
        minHeight: "84px",
        height: "100%",
        borderColor: isHovered ? coupon.accent : "rgba(229, 229, 229, 0.85)",
        boxShadow: isHovered
          ? `0 10px 25px -5px ${coupon.accent}22, 0 8px 10px -6px ${coupon.accent}22`
          : "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)"
      }}
      onClick={() => navigate("products", { badge: "Sale" })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shimmer sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)",
        }}
      />

      {/* LEFT — Colored badge strip */}
      <div
        className="flex flex-col items-center justify-center shrink-0 text-white"
        style={{
          background: coupon.badgeBg,
          minWidth: "clamp(48px, 10vw, 72px)",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
          letterSpacing: "0.12em",
          fontSize: "clamp(7px, 1.5vw, 9px)",
          fontWeight: "800",
          padding: "12px 8px",
        }}
      >
        {coupon.label}
      </div>

      {/* Notch cutouts — left and right of divider */}
      <div className="flex items-center shrink-0">
        {/* Left notch */}
        <div
          style={{
            width: "10px",
            height: "20px",
            borderRadius: "0 10px 10px 0",
            background: "white",
            boxShadow: "inset -2px 0 0 rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        />
        {/* Dashed divider */}
        <div
          style={{
            width: "1px",
            height: "100%",
            minHeight: "60px",
            borderLeft: "2px dashed rgba(0,0,0,0.12)",
            margin: "0 2px",
          }}
        />
        {/* Right notch */}
        <div
          style={{
            width: "10px",
            height: "20px",
            borderRadius: "10px 0 0 10px",
            background: "white",
            boxShadow: "inset 2px 0 0 rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        />
      </div>

      {/* CENTER — Offer text */}
      <div className="flex flex-col justify-center px-2 sm:px-4 py-3 flex-1 min-w-0">
        <p className="text-[8px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-0.5 flex items-center gap-1">
          <Sparkles size={8} />
          {coupon.subtext}
        </p>
        <h3
          className="font-extrabold tracking-tight leading-none"
          style={{ fontSize: "clamp(0.9rem, 3vw, 1.4rem)", color: coupon.accent }}
        >
          {coupon.headline}
        </h3>
        <p className="text-[8px] sm:text-[9px] text-neutral-600 mt-1 font-medium leading-snug">{coupon.condition}</p>
      </div>

      {/* RIGHT — Code + Copy (Sleek unified pill for mobile, full stacked layout for larger screens) */}
      <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-3 shrink-0 gap-1.5">
        {/* Unified Interactive Code Button for Mobile viewports */}
        <button
          onClick={handleCopy}
          className="flex flex-col items-center justify-center border-2 border-dashed p-1.5 text-center rounded-xs transition-all duration-250 cursor-pointer focus:outline-none min-h-0 min-w-[76px] sm:hidden"
          style={{
            borderColor: copied ? "#22c55e" : coupon.accent,
            backgroundColor: copied ? "rgba(34, 197, 94, 0.05)" : "transparent",
          }}
        >
          <span className="text-[6px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5 leading-none">
            {copied ? "Success" : "Tap to Copy"}
          </span>
          <div className="flex items-center gap-1 leading-none">
            <span
              className="font-black tracking-wide text-[9px] uppercase leading-none"
              style={{ color: copied ? "#22c55e" : coupon.accent }}
            >
              {copied ? "COPIED" : coupon.code}
            </span>
            {copied ? (
              <Check size={8} strokeWidth={3.5} className="text-[#22c55e] shrink-0" />
            ) : (
              <Copy size={8} style={{ color: coupon.accent }} className="shrink-0" />
            )}
          </div>
        </button>

        {/* Traditional Double Element Layout for Desktop viewports */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-1.5">
          <div
            className="border-2 border-dashed px-2 py-1 text-center"
            style={{ borderColor: coupon.accent }}
          >
            <p className="text-[7px] sm:text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">
              Use Code
            </p>
            <p
              className="font-black tracking-wider text-[9px] sm:text-xs"
              style={{ color: coupon.accent }}
            >
              {coupon.code}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-4 py-2 transition-all duration-200 focus:outline-none min-h-0"
            style={{
              background: copied ? "#22c55e" : coupon.accent,
              color: "white",
              minHeight: "unset",
              minWidth: "unset",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
            }}
          >
            {copied ? (
              <><Check size={8} strokeWidth={3} /> Copied!</>
            ) : (
              <><Copy size={8} /> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Shop Now CTA on hover — desktop only */}
      <div className="hidden sm:flex items-center justify-center px-3 sm:px-4 py-3 shrink-0 border-l border-neutral-200/60 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <div className="flex flex-col items-center gap-1 text-center">
          <ShoppingBag size={14} style={{ color: coupon.accent }} />
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider" style={{ color: coupon.accent }}>
            Shop Now
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CouponBanner({ navigate }) {
  const { coupons, addToast } = useApp();
  const activeCoupons = coupons.filter((c) => c.active);

  const [activeIndex, setActiveIndex] = useState(0);

  if (activeCoupons.length === 0) return null;

  return (
    <div className="w-full">
      {/* Mobile Slider View */}
      <div className="block sm:hidden relative overflow-hidden w-full">
        <div
          className="flex items-stretch transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {activeCoupons.map((coupon) => (
            <div key={coupon.id} className="w-full shrink-0 px-1 pb-1">
              <SingleCoupon
                coupon={coupon}
                navigate={navigate}
                addToast={addToast}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center gap-1.5 mt-2.5">
          {activeCoupons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none min-h-unset min-w-unset ${
                activeIndex === idx ? "w-4 bg-[#FF4D6D]" : "w-1.5 bg-neutral-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {activeCoupons.map((coupon) => (
          <SingleCoupon
            key={coupon.id}
            coupon={coupon}
            navigate={navigate}
            addToast={addToast}
          />
        ))}
      </div>
    </div>
  );
}

