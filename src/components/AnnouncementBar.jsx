import React from "react";
import { Sparkles, Zap, Package } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AnnouncementBar() {
  const { settings, coupons = [] } = useApp();

  const featuredCoupon = coupons.find((c) => c.active);
  const items = [
    `FREE SHIPPING ON ALL ORDERS ABOVE ₹${(settings?.shippingThreshold || 1500).toLocaleString("en-IN")}`,
    featuredCoupon ? `LIMITED TIME SALE: USE CODE '${featuredCoupon.code}'` : "LIMITED TIME SALE IS LIVE NOW",
    "EASY RETURNS & 15-DAY HASSLE-FREE EXCHANGES"
  ];

  const renderPass = () => (
    <div className="flex items-center gap-12 sm:gap-16 px-4 sm:px-8 whitespace-nowrap shrink-0">
      {items.map((text, idx) => {
        const Icon = idx === 0 ? Sparkles : idx === 1 ? Zap : Package;
        return (
          <span key={idx} className="flex items-center gap-2.5 uppercase font-bold text-[8.5px] min-[360px]:text-[9.5px] sm:text-[11px] tracking-[0.15em] text-white/90">
            <Icon size={12} strokeWidth={2.5} className="shrink-0 text-[#FF4D6D] animate-pulse" />
            {text}
          </span>
        );
      })}
      <span className="text-[#FF4D6D] font-black text-xs select-none">✦</span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111] text-white h-[32px] md:h-[36px] flex items-center overflow-hidden border-b border-white/10 font-display select-none shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <style>{`
        @keyframes marquee-slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee-slide 22s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="w-full overflow-hidden flex whitespace-nowrap">
        <div className="flex animate-marquee-infinite shrink-0">
          {renderPass()}
          {renderPass()}
        </div>
      </div>
    </div>
  );
}
