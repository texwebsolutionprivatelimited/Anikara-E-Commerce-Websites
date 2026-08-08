import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Clock, Flame, ArrowRight, Sparkles } from "lucide-react";

export default function Deals({ navigate }) {
  const { products, settings } = useApp();

  // Settings values with sensible defaults
  const showTimer = settings?.showDealTimer !== false;
  const showStockBar = settings?.showDealStockBar !== false;
  const itemsLeft = settings?.dealItemsLeft !== undefined ? Number(settings.dealItemsLeft) : 34;
  const totalStock = settings?.dealTotalStock !== undefined ? Number(settings.dealTotalStock) : 50;

  // Calculate percentage of claimed stock for progress bar (█████████░░)
  const claimedPercent = totalStock > 0 
    ? Math.min(100, Math.max(10, Math.round(((totalStock - itemsLeft) / totalStock) * 100))) 
    : 68;

  // Filter deal products
  const dealProducts = products.filter((p) => {
    const section = p.displaySection && p.displaySection !== "all" ? p.displaySection : "deals";
    return section === "deals";
  });

  const getTimeLeft = () => {
    const endTime = settings?.dealEndsAt ? new Date(settings.dealEndsAt).getTime() : Date.now() + (5 * 3600 + 22 * 60 + 10) * 1000;
    const diff = Math.max(0, endTime - Date.now());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [settings?.dealEndsAt]);

  return (
    <section className="bg-[#FFF9F7] py-6 sm:py-9 md:py-12 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#FF4D6D]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Luxury Rounded Frame Container without harsh borders */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_12px_45px_rgba(255,77,109,0.06)] relative overflow-hidden">
          
          {/* Top Decorative Line Frame */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-[#FF4D6D]/30 to-[#FF4D6D]/60" />
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-[#FF4D6D] uppercase font-display flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FF4D6D]" /> Today's Best Offers
            </span>
            <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-l from-transparent via-[#FF4D6D]/30 to-[#FF4D6D]/60" />
          </div>

          <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 gap-3">
            {/* Main Header */}
            <h2 className="text-2xl min-[375px]:text-3xl md:text-4xl lg:text-[48px] font-black tracking-tight leading-tight text-[#111111] font-display">
              Deals of the Day
            </h2>

            {/* Countdown Timer UI (08h 12m 22s) */}
            {showTimer && (
              <div className="flex items-center justify-center gap-2 pt-1 font-display">
                <Clock size={16} className="text-[#FF4D6D] shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mr-1">ENDS IN:</span>
                <div className="flex gap-1.5 items-center font-mono">
                  <div className="flex flex-col items-center">
                    <span className="bg-[#111111] text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm">
                      {String(timeLeft.hours).padStart(2, "0")}h
                    </span>
                  </div>
                  <span className="text-neutral-800 font-bold text-xs">:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-[#111111] text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm">
                      {String(timeLeft.minutes).padStart(2, "0")}m
                    </span>
                  </div>
                  <span className="text-neutral-800 font-bold text-xs">:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-[#FF4D6D] text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm shadow-[0_0_12px_rgba(255,77,109,0.4)] animate-pulse">
                      {String(timeLeft.seconds).padStart(2, "0")}s
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Urgency Stock Left & Progress Bar */}
            {showStockBar && (
              <div className="w-full max-w-sm sm:max-w-md mx-auto mt-2.5 px-4 py-3 bg-[#FFF5F7] rounded-2xl shadow-[0_4px_20px_rgba(255,77,109,0.08)] flex flex-col items-center space-y-2">
                <div className="flex items-center justify-between w-full text-xs font-bold">
                  <span className="text-[#FF4D6D] flex items-center gap-1.5">
                    <span className="animate-bounce">🔥</span>
                    <span className="font-extrabold uppercase tracking-wide">Only {itemsLeft} items left</span>
                  </span>
                  <span className="text-neutral-500 text-[10px] font-bold">
                    {claimedPercent}% claimed
                  </span>
                </div>
                {/* Visual Urgency Progress Bar */}
                <div className="w-full h-2.5 bg-neutral-200/60 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-[#FF4D6D] to-[#FF1E46] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,77,109,0.5)]"
                    style={{ width: `${claimedPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop/Laptop Banner */}
          <div 
            onClick={() => navigate("products", { badge: "Sale" })}
            className="hidden lg:block w-full mb-6 cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:opacity-95 transition-all duration-300"
          >
            <img 
              src="/12.png" 
              alt="Deals of the Day Banner" 
              className="w-full h-auto object-contain rounded-2xl block"
            />
          </div>

          {/* Mobile/Tablet Banner */}
          <div 
            onClick={() => navigate("products", { badge: "Sale" })}
            className="block lg:hidden w-full mb-4 cursor-pointer overflow-hidden rounded-xl shadow-sm hover:opacity-95 transition-all duration-300"
          >
            <img 
              src="/22.jpeg" 
              alt="Deals of the Day Mobile Banner" 
              className="w-full h-auto object-contain rounded-xl block"
            />
          </div>

          {/* Static Grid for Deals (2 items per row on mobile, 6 items per row on desktop) */}
          <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-2.5 min-[375px]:gap-x-3.5 sm:gap-x-4 lg:gap-x-5 gap-y-4 sm:gap-y-6">
            {dealProducts.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>

          {/* View All Deals Button without top divider line */}
          <div className="text-center mt-6 sm:mt-8 pt-4">
            <button
              onClick={() => navigate("products", { badge: "Sale" })}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] hover:from-[#FF4D6D] hover:to-[#FF1E46] text-white text-[13px] md:text-[15px] font-bold tracking-widest uppercase transition-all duration-500 rounded-full shadow-lg hover:shadow-[0_8px_30px_rgba(255,77,109,0.45)] hover:scale-105 cursor-pointer focus:outline-none font-sans"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <span className="relative z-10">View All Deals</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
