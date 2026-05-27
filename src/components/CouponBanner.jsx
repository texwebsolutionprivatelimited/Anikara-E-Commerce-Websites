import React, { useState } from "react";
import { Tag, Copy, Check, ShoppingBag, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

const COUPONS = [
  {
    id: 1,
    label: "1ST ORDER",
    headline: "FLAT ₹300 OFF",
    subtext: "On your 1st purchase",
    code: "ANIKARA300",
    condition: "Min. order ₹999 • New users only",
    accent: "#FF4D6D",
    bg: "from-[#fff5f7] to-[#fff0f3]",
    badgeBg: "#FF4D6D",
  },
  {
    id: 2,
    label: "APP EXCLUSIVE",
    headline: "FLAT 20% OFF",
    subtext: "Sitewide — limited time",
    code: "ANIKARA20",
    condition: "All categories • No min. order",
    accent: "#111111",
    bg: "from-[#f5f5f5] to-[#f0f0f0]",
    badgeBg: "#111111",
  },
  {
    id: 3,
    label: "FESTIVE SPECIAL",
    headline: "BUY 2 GET 1 FREE",
    subtext: "On selected ethnic wear",
    code: "NIKFEST3",
    condition: "Applies on Ethnic Wear category",
    accent: "#c9860a",
    bg: "from-[#fffbf0] to-[#fff8e6]",
    badgeBg: "#c9860a",
  },
];

function SingleCoupon({ coupon, navigate, addToast }) {
  const [copied, setCopied] = useState(false);

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
      className={`relative flex items-stretch bg-gradient-to-r ${coupon.bg} border border-neutral-200/80 overflow-hidden group cursor-pointer select-none`}
      style={{ borderRadius: "6px", minHeight: "72px" }}
      onClick={() => navigate("products", { badge: "Sale" })}
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
        <p className="text-[8px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-0.5 flex items-center gap-1">
          <Sparkles size={8} />
          {coupon.subtext}
        </p>
        <h3
          className="font-extrabold tracking-tight leading-none"
          style={{ fontSize: "clamp(0.9rem, 3vw, 1.4rem)", color: coupon.accent }}
        >
          {coupon.headline}
        </h3>
        <p className="text-[8px] sm:text-[9px] text-neutral-400 mt-1 font-light leading-snug">{coupon.condition}</p>
      </div>

      {/* RIGHT — Code + Copy */}
      <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-3 shrink-0 gap-1.5">
        <div
          className="border-2 border-dashed px-2 py-1 text-center"
          style={{ borderColor: coupon.accent }}
        >
          <p className="text-[7px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
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
          className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-1 transition-all duration-200 rounded-sm focus:outline-none min-h-0"
          style={{
            background: copied ? "#22c55e" : coupon.accent,
            color: "white",
            minHeight: "unset",
            minWidth: "unset",
          }}
        >
          {copied ? (
            <><Check size={8} strokeWidth={3} /> Copied!</>
          ) : (
            <><Copy size={8} /> Copy</>
          )}
        </button>
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

  if (activeCoupons.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-1">
        <Tag size={13} className="text-[#FF4D6D] shrink-0" />
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
          Exclusive Offers & Coupons
        </span>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>

      {/* Coupon grid — 1 col mobile, 2 col sm, 3 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
